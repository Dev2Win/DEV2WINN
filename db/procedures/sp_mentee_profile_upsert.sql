CREATE PROCEDURE sp_mentee_profile_upsert(
  IN p_user_id        CHAR(36),
  IN p_career_path    VARCHAR(120),
  IN p_goals          TEXT,
  IN p_desired_skills JSON,
  IN p_languages      JSON,
  IN p_availability   JSON
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND role = 'mentee') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'MENTEE_ROLE_REQUIRED:Signed-in user must have mentee role';
  END IF;

  INSERT INTO mentee_profiles (
    user_id, career_path, goals, desired_skills, languages, availability
  ) VALUES (
    p_user_id, p_career_path, p_goals, p_desired_skills, p_languages, p_availability
  )
  ON DUPLICATE KEY UPDATE
    career_path = VALUES(career_path),
    goals = VALUES(goals),
    desired_skills = VALUES(desired_skills),
    languages = VALUES(languages),
    availability = VALUES(availability);

  SELECT user_id, career_path, goals, desired_skills, languages, availability, updated_at
  FROM mentee_profiles
  WHERE user_id = p_user_id;
END;
