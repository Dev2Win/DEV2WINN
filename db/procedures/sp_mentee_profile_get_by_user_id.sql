CREATE PROCEDURE sp_mentee_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, career_path, goals, desired_skills, languages, availability, updated_at
  FROM mentee_profiles
  WHERE user_id = p_user_id;
END;
