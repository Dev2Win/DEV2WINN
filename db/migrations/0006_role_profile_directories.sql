-- Migration 0006 — mentor and mentee directory procedures.

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_list;

-- @statement
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

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_list;

-- @statement
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
