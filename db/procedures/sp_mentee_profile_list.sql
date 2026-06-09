CREATE PROCEDURE sp_mentee_profile_list()
BEGIN
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    mt.career_path,
    mt.goals,
    mt.desired_skills,
    mt.languages,
    mt.availability,
    mt.updated_at
  FROM mentee_profiles mt
  INNER JOIN users u ON u.id = mt.user_id
  WHERE u.role = 'mentee'
  ORDER BY mt.updated_at DESC;
END;
