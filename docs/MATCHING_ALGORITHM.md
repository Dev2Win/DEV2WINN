# Mentor ↔ Mentee Matching Engine

> Design for the matching service (lives in `apps/ai`, Python). Last reviewed 2026-06-04.

We match mentees to mentors (and surface mentees to mentors) using a **hybrid**
score: **content similarity (TF-IDF + cosine)** over profile text, blended with
**structured rule-based filters/boosts** (availability, language, experience,
industry), and refined over time by a **feedback signal**. We start simple
(explainable, cheap) and leave a clear path to embeddings/learning-to-rank.

---

## 1. Why hybrid (not pure similarity)
- Pure TF-IDF/cosine captures *topical* fit (skills, career path, bio language) but
  ignores hard constraints (timezone/availability, language) and business boosts
  (verified mentors, capacity).
- Pure rules are rigid and can't capture nuance in free-text profiles.
- **Hybrid = explainable + good cold-start + tunable.**

```
final_score = w_sim * cosine_sim(mentee_vec, mentor_vec)
            + w_rule * rule_score(filters/boosts)
            + w_fb   * feedback_adjustment
            - penalties (capacity full, inactive, language mismatch)
```
Weights `w_*` are configurable and tuned against feedback (see §6).

---

## 2. Building the document (text → vector)

For each mentor and mentee, build a normalized "profile document" from structured
+ free-text fields:

- **Mentee doc:** `career_path`, `desired_skills[]`, `industry_pref[]`,
  `experience_level`, `education_status`, free-text goals/bio.
- **Mentor doc:** `expertise[]`, `career_preferences[]`, `industry_pref[]`,
  `work_experience[]`, `title`, `languages[]`, `description/bio`.

**Text normalization pipeline:**
1. Lowercase, strip punctuation/HTML.
2. Tokenize; remove stopwords; lemmatize.
3. **Domain synonym/skill normalization** (e.g., `js`/`javascript`/`node` → canonical;
   `frontend`/`front-end`/`fe`). Maintain a curated skills taxonomy.
4. Weight important fields by **repetition or field boosts** (e.g., repeat
   `career_path` tokens so they carry more TF-IDF weight), or compute per-field
   vectors and combine.

> Keep the skills taxonomy in the DB/CMS so it's maintainable, and reuse it across
> matching, onboarding autocomplete, and roadmap tagging.

---

## 3. TF-IDF + cosine similarity (the core)

1. **Corpus:** all mentor docs (for mentee→mentor) form the corpus over which
   TF-IDF is fit. Refit periodically (vocabulary drifts as users join).
2. **Vectorize:** `TfidfVectorizer` (scikit-learn) with uni+bigrams,
   `sublinear_tf=True`, `min_df`/`max_df` tuning, custom tokenizer using the
   taxonomy. Mentor docs → matrix `M`. Mentee doc → vector `q` (transform with the
   *same* fitted vectorizer).
3. **Similarity:** `cosine_similarity(q, M)` → a score in `[0,1]` per mentor.
4. **Rank** by score; take top-K candidates into the hybrid re-rank stage.

```python
# sketch (apps/ai/matching/tfidf.py)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = TfidfVectorizer(
    ngram_range=(1, 2), sublinear_tf=True, min_df=2, max_df=0.9,
    tokenizer=skill_aware_tokenizer, preprocessor=normalize,
)
M = vectorizer.fit_transform(mentor_docs)        # fit on mentor corpus
q = vectorizer.transform([mentee_doc])           # same vocabulary
sims = cosine_similarity(q, M).ravel()           # [0,1] per mentor
```

**Performance:** TF-IDF matrices are sparse; cosine is fast for thousands of
mentors. For larger scale, precompute `M` and cache; only `transform` the query.

---

## 4. Structured rule layer (filters + boosts)

Applied as **hard filters** (exclude) and **soft boosts** (adjust score):

**Hard filters (must pass):**
- Mentor is active, verified (if required tier), and **has capacity** (open slots).
- **Language** overlap (at least one shared language).
- Optional availability overlap if booking-intent is known.

**Soft boosts/penalties (added to `rule_score`):**
- Industry preference overlap (+).
- Experience-level appropriateness (mentor seniority ≥ mentee need) (+).
- Availability/timezone overlap strength (+).
- Mentor rating/reviews (+), recency of activity (+).
- Capacity nearly full (−), long response time (−).

`rule_score` is a normalized weighted sum in `[0,1]` so it's comparable to cosine.

---

## 5. Vectors at scale → Qdrant (optional/next)

- Persist mentor vectors in **Qdrant** for fast top-K retrieval and to avoid
  recomputing cosine over the whole corpus on each request.
- TF-IDF vectors are high-dim sparse; either (a) store them and use Qdrant sparse
  vectors, or (b) upgrade the *similarity* component to **dense embeddings** (e.g.,
  sentence-transformers or an embedding API) for semantic matches, stored as dense
  vectors in Qdrant. Recommended path: **start TF-IDF in-process → add dense
  embeddings in Qdrant** when semantic recall matters.
- **Recompute trigger:** a **BullMQ worker** re-embeds/re-upserts a user's vector
  whenever their profile changes; full corpus refit on a schedule (e.g., nightly).

---

## 6. Cold start & feedback loop

**Cold start (few users / sparse profiles):**
- Fall back to **rule-only** ranking (career_path + industry + availability).
- Use onboarding-captured tags directly; prompt users to enrich profiles.
- Seed with popular/verified mentors in the relevant career path.

**Feedback loop (continuous improvement):**
- Log outcomes: match shown → viewed → contacted → booked → completed → reviewed.
- `feedback_adjustment` nudges scores for pairs/segments that convert well.
- Periodically tune weights `w_sim/w_rule/w_fb` via offline evaluation (precision@K,
  booking conversion). Long-term: **learning-to-rank** (e.g., LightGBM ranker) using
  these signals as features — but only once there's enough data.

---

## 7. API & integration

- **AI service** exposes `POST /v1/match` (service-JWT only):
  `{ userId, role, intent?, limit }` → ranked `[{ candidateId, score, reasons[] }]`.
- **`reasons[]`** make matches **explainable** ("shares React + fintech; available
  weekends; 4.8★"). Explainability is a product feature, not just debugging.
- **`apps/api`** `matching` module calls this, **caches** results in Redis (per user,
  short TTL + invalidate on profile change), and serves the dashboard.
- Recompute/refit handled by `apps/worker`.

---

## 8. Evaluation

- **Offline:** precision@K, recall@K, nDCG against a labeled set; track per segment.
- **Online:** match→view, view→contact, contact→booking, booking→completion,
  review score. A/B test weight changes.
- **Guardrails:** diversity (don't always surface the same 3 mentors → fan out load),
  fairness (avoid bias toward one group), capacity balancing.

---

## 9. Rollout (ties to plan.md Phase 3)
1. v0: rule-only (cold start) — ships first, unblocks the dashboard.
2. v1: TF-IDF + cosine in-process + rule re-rank + explainable reasons.
3. v2: Qdrant-backed vectors + recompute worker + nightly refit.
4. v3: dense embeddings for semantic recall; feedback-tuned weights.
5. v4: learning-to-rank once data supports it.
