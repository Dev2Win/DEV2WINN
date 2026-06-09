CREATE PROCEDURE sp_mentor_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, title, bio, expertise, career_preferences, languages, availability, updated_at
  FROM mentor_profiles
  WHERE user_id = p_user_id;
END;
