# Feature Catalog

A detailed inventory of what exists in the codebase, grouped by area, with a
status flag and the relevant source locations.

**Status legend:** ✅ Built & working · ⚠️ Partial / stubbed / mock data · ❌ Planned only

---

## 1. Marketing site (public)

| Feature | Status | Location |
|---------|--------|----------|
| Landing page (hero, gallery, CTA) | ✅ | `app/page.tsx`, `components/shared/Herosection.tsx` |
| "What we offer" section | ✅ | `components/shared/WhatWeOffer.tsx` |
| Features section | ✅ | `components/shared/Features.tsx` |
| Navbar / Footer | ✅ | `components/shared/Navbar.tsx`, `Footer.tsx` |
| About page | ✅ | `app/about/` |
| Contact page + form | ✅ (form UI) | `app/contact/`, `components/shared/ContactForm.tsx` |
| Join-us CTA | ✅ | `components/shared/JoinUs.tsx` |

## 2. Authentication & onboarding

| Feature | Status | Location |
|---------|--------|----------|
| Sign in / Sign up (Clerk) | ✅ | `app/(auth)/sign-in`, `app/(auth)/sign-up` |
| User → MongoDB sync (webhook) | ✅ | `app/api/webhooks/clerk/route.ts`, `lib/connect.ts` |
| Route protection | ✅ | `middleware.ts` |
| Mentor/Mentee role selection | ⚠️ UI only, not persisted | `app/user-type/page.tsx` |
| Stepper component | ✅ | `components/profile/Stepper.tsx` |
| Mentee onboarding steps | ⚠️ Form UI; partial persistence | `components/profile/StepOneMentee.tsx`, `StepTwoMentee.tsx` |
| Mentor onboarding steps | ⚠️ Form UI; partial persistence | `components/profile/StepOneMentor.tsx`, `StepTwoMentor.tsx`, `StepFourForm.tsx` |
| Profile image upload | ⚠️ | `components/profile/ProfileImageUpload.tsx`, `lib/uploadFile.ts` |

## 3. Dashboard & LMS

| Feature | Status | Location |
|---------|--------|----------|
| Dashboard shell (Sidebar + Navbar) | ✅ | `app/(root)/dashboard/layout.tsx`, `components/Sidebar.tsx` |
| Role-based sidebar config | ✅ | `constants/index.ts` |
| Course carousel | ✅ | `app/(root)/dashboard/page.tsx`, `components/lms/Card.tsx` |
| Course roadmap (modules/submodules) | ✅ (static content) | `app/(root)/dashboard/(course)/[courseId]/` |
| Submodule detail view | ✅ | `.../[courseId]/[courseDetail]/page.tsx` |
| Course content source | ⚠️ Static | `lib/lmscontent.ts`, `software-engineering.json` |
| Performance "speedometer" | ⚠️ Mock value (8.966) | `components/lms/Speedometer.tsx` |
| Bar chart / dashboard widgets | ✅ | `components/lms/BarChart.tsx`, `Header.tsx`, `Todo.tsx` |
| "Top mentor matches" list | ⚠️ Hardcoded array + broken fetch | `app/(root)/dashboard/page.tsx` |

## 4. Matching & directories

| Feature | Status | Location |
|---------|--------|----------|
| Recommendation endpoint | ⚠️ Naive career-path match | `app/api/users/recommendations/route.ts` |
| Mentor directory | ✅ | `components/users/Mentors.tsx`, `UserCard.tsx` |
| Mentee directory | ✅ | `components/users/Mentees.tsx` |
| Mentors page | ✅ | `app/(root)/dashboard/mentors/page.tsx` |
| Mentor CRUD API | ✅ create/list | `app/api/users/mentor/route.ts`, `.../[mentorId]/route.ts` |
| Mentee CRUD API | ✅ create/list | `app/api/users/mentee/route.ts`, `.../[menteeId]/route.ts` |
| Current-user fetch | ✅ | `app/api/users/me/[Id]/route.ts`, `app/api/users/[userId]/route.ts` |

## 5. User profiles

| Feature | Status | Location |
|---------|--------|----------|
| Profile overview | ✅ UI | `components/userProfile/Overview.tsx`, `ProfileCard.tsx` |
| About / Basic info | ✅ UI | `About.tsx`, `BasicInfo.tsx` |
| Education (list/form/section) | ⚠️ UI; persistence partial | `Education*.tsx` |
| Experience (list/form/modal) | ⚠️ UI; persistence partial | `Experience*.tsx`, `ModalExperience.tsx` |
| Background | ✅ UI | `Background.tsx`, `BackgroundComp.tsx` |
| Social links | ✅ UI | `SocialLinks.tsx` |
| Reviews | ⚠️ UI only, no backend | `Reviews.tsx` |
| Profile pages (mentor/mentee) | ✅ | `app/profile/mentor`, `app/profile/mentee` |

## 6. Video meetings (Stream)

| Feature | Status | Location |
|---------|--------|----------|
| Stream client provider + token | ✅ | `providers/StreamClientProvider.tsx`, `actions/stream.actions.ts` |
| Instant meeting | ✅ | `components/meeting/MeetingTypeList.tsx` |
| Schedule meeting (date/desc) | ✅ | `MeetingTypeList.tsx`, `MeetingModal.tsx`, `SheduleList.tsx` |
| Join via link | ✅ | `MeetingTypeList.tsx` |
| Meeting room (controls) | ✅ | `components/meeting/MeetingRoom.tsx`, `MeetingSetup.tsx` |
| End-call button | ✅ | `components/meeting/EndCallButton.tsx` |
| Call list / cards | ✅ | `CallList.tsx`, `MeetingCard.tsx`, `HomeCard.tsx` |
| Upcoming meetings | ✅ | `app/(root)/dashboard/upcoming/page.tsx` |
| Previous meetings | ✅ | `app/(root)/dashboard/previous/page.tsx` |
| Recordings | ✅ | `app/(root)/dashboard/recordings/page.tsx` |
| Personal room | ✅ | `app/(root)/dashboard/personal-room/page.tsx` |
| Call hooks | ✅ | `hooks/useGetCalls.ts`, `useGetCallById.ts` |

## 7. Chat / messaging

| Feature | Status | Location |
|---------|--------|----------|
| Chat window / UI | ⚠️ UI built | `components/chat/ChatWindow.tsx`, `ChatRender.tsx`, `Message.tsx`, `Input.tsx` |
| Chat menu / contacts | ⚠️ UI built (mock users) | `ChatMenu.tsx`, `ChatMenuCard.tsx`, `users.ts` |
| Socket.io client hook | ⚠️ Stubbed (`localhost:3001`, "not in use") | `components/chat/useChat.ts` |
| Conversation/message model | ✅ schema | `models/conversationModel.ts` |
| Chat page | ⚠️ | `app/(root)/dashboard/chat/page.tsx` |

## 8. Explore (Q&A forum)

| Feature | Status | Location |
|---------|--------|----------|
| Post create/list/update/delete API | ✅ | `app/api/explore/post/route.ts` |
| Comment API | ✅ | `app/api/explore/post/comment/route.ts` |
| Question card / page | ✅ | `components/explore/QuestionCard.tsx`, `QuestionPage.tsx` |
| Answer form / list / card | ✅ | `components/explore/Answer*.tsx` |
| Explore render / feed | ✅ | `components/explore/RenderExplore.tsx` |
| Explore pages | ✅ | `app/(root)/dashboard/explore/`, `.../[postId]/page.tsx` |
| Post model | ✅ | `models/Post.ts`, `models/Comment.ts` |

## 9. Notifications & misc

| Feature | Status | Location |
|---------|--------|----------|
| Notification popup | ⚠️ UI only, no backend | `components/notication/NotificationPopup.tsx` |
| Toasts | ✅ | `components/ui/toast.tsx`, `use-toast.ts` |
| Reusable modals/alerts/loaders | ✅ | `components/reusables/*` |
| Resources page | ⚠️ | `app/(root)/dashboard/resources/page.tsx` |

---

## 10. Summary of gaps (the "almost-there" list)

1. **Role selection isn't persisted** — `user-type` page never saves the choice.
2. **Onboarding forms** capture data but wiring to the create APIs is incomplete.
3. **Chat is non-functional** — needs a Socket.io server (or migration to Stream Chat).
4. **Dashboard mentor matches** use a hardcoded array and a broken
   `https://localhost:3000` fetch.
5. **Performance/progress** is a fixed mock value, not computed from activity.
6. **Reviews & notifications** have UI but no backend.
7. **Course content** is static; no per-user progress tracking or authoring.
8. **Recommendations** use naive equality matching on a single field.
