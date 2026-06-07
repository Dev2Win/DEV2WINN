from app.evaluation import evaluate_matching_fixture


def test_matching_eval_fixture_scores_expected_matches():
    result = evaluate_matching_fixture()
    assert result["metrics"]["precision_at_1"] >= 0.75
    assert result["metrics"]["mrr"] >= 0.75
    assert result["case_count"] == 4
