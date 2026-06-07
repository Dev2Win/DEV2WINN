-- Migration 0002 — matching feedback signals.
-- Feedback is captured through stored procedures so app code stays SQL-free.

-- @statement
CREATE TABLE IF NOT EXISTS matching_feedback (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id  CHAR(36)        NOT NULL,
  candidate_id   CHAR(36)        NOT NULL,
  actor_role     ENUM('mentee', 'mentor') NOT NULL,
  event_type     ENUM('shown', 'viewed', 'dismissed', 'contacted', 'booked', 'completed', 'reviewed') NOT NULL,
  rating         TINYINT UNSIGNED NULL,
  metadata_json  JSON NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_matching_feedback_actor_created (actor_user_id, created_at),
  KEY idx_matching_feedback_candidate_created (candidate_id, created_at),
  KEY idx_matching_feedback_event_created (event_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
DROP PROCEDURE IF EXISTS sp_matching_feedback_record;

-- @statement
CREATE PROCEDURE sp_matching_feedback_record(
  IN p_actor_user_id CHAR(36),
  IN p_candidate_id  CHAR(36),
  IN p_actor_role    VARCHAR(20),
  IN p_event_type    VARCHAR(32),
  IN p_rating        TINYINT UNSIGNED,
  IN p_metadata_json JSON
)
BEGIN
  IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'INVALID_RATING:Rating must be between 1 and 5';
  END IF;

  INSERT INTO matching_feedback (
    actor_user_id,
    candidate_id,
    actor_role,
    event_type,
    rating,
    metadata_json
  )
  VALUES (
    p_actor_user_id,
    p_candidate_id,
    p_actor_role,
    p_event_type,
    p_rating,
    p_metadata_json
  );

  SELECT
    id,
    actor_user_id,
    candidate_id,
    actor_role,
    event_type,
    rating,
    metadata_json,
    created_at
  FROM matching_feedback
  WHERE id = LAST_INSERT_ID();
END;
