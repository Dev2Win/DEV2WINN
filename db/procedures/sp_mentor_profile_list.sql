CREATE PROCEDURE sp_mentor_profile_list()
BEGIN
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    mp.title,
    mp.bio,
    mp.expertise,
    mp.career_preferences,
    mp.languages,
    mp.availability,
    mp.updated_at
  FROM mentor_profiles mp
  INNER JOIN users u ON u.id = mp.user_id
  WHERE u.role = 'mentor'
  ORDER BY mp.updated_at DESC;
END;
