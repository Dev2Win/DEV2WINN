-- Migration 0005 — mentor and mentee role-specific profiles.

-- @statement
CREATE TABLE IF NOT EXISTS mentor_profiles (
  user_id              CHAR(36) NOT NULL,
  title                VARCHAR(140) NULL,
  bio                  TEXT NULL,
  expertise            JSON NOT NULL,
  career_preferences   JSON NOT NULL,
  languages            JSON NOT NULL,
  availability         JSON NOT NULL,
  created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_mentor_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
CREATE TABLE IF NOT EXISTS mentee_profiles (
  user_id          CHAR(36) NOT NULL,
  career_path      VARCHAR(120) NULL,
  goals            TEXT NULL,
  desired_skills   JSON NOT NULL,
  languages        JSON NOT NULL,
  availability     JSON NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_mentee_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_upsert;

-- @statement
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

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_get_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentor_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, title, bio, expertise, career_preferences, languages, availability, updated_at
  FROM mentor_profiles
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_upsert;

-- @statement
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

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_get_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentee_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, career_path, goals, desired_skills, languages, availability, updated_at
  FROM mentee_profiles
  WHERE user_id = p_user_id;
END;
