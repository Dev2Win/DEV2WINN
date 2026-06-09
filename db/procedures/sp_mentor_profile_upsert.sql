CREATE PROCEDURE sp_mentor_profile_upsert(
  IN p_user_id            CHAR(36),
  IN p_title              VARCHAR(140),
  IN p_bio                TEXT,
  IN p_expertise          JSON,
  IN p_career_preferences JSON,
  IN p_languages          JSON,
  IN p_availability       JSON
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND role = 'mentor') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'MENTOR_ROLE_REQUIRED:Signed-in user must have mentor role';
  END IF;

  INSERT INTO mentor_profiles (
    user_id, title, bio, expertise, career_preferences, languages, availability
  ) VALUES (
    p_user_id, p_title, p_bio, p_expertise, p_career_preferences, p_languages, p_availability
  )
  ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    bio = VALUES(bio),
    expertise = VALUES(expertise),
    career_preferences = VALUES(career_preferences),
    languages = VALUES(languages),
    availability = VALUES(availability);

  SELECT user_id, title, bio, expertise, career_preferences, languages, availability, updated_at
  FROM mentor_profiles
  WHERE user_id = p_user_id;
END;
