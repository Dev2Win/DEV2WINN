-- Migration 0007 — finish Phase 1/2 auth, profiles, directories.

-- @statement
ALTER TABLE users
  ADD COLUMN avatar_url VARCHAR(512) NULL AFTER last_name,
  ADD COLUMN avatar_public_id VARCHAR(255) NULL AFTER avatar_url;

-- @statement
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id                CHAR(36)     NOT NULL,
  user_id           CHAR(36)     NOT NULL,
  provider          ENUM('google', 'github') NOT NULL,
  provider_user_id  VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  email_verified    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_oauth_provider_user (provider, provider_user_id),
  KEY idx_oauth_user_id (user_id),
  CONSTRAINT fk_oauth_accounts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP    NOT NULL,
  used_at     TIMESTAMP    NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_password_reset_token_hash (token_hash),
  KEY idx_password_reset_user_id (user_id),
  CONSTRAINT fk_password_reset_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
ALTER TABLE mentor_profiles
  ADD COLUMN experience_level VARCHAR(80) NULL AFTER bio,
  ADD COLUMN industries JSON NULL AFTER experience_level,
  ADD COLUMN cv_url VARCHAR(512) NULL AFTER industries;

-- @statement
UPDATE mentor_profiles
SET industries = JSON_ARRAY()
WHERE industries IS NULL;

-- @statement
ALTER TABLE mentor_profiles
  MODIFY COLUMN industries JSON NOT NULL;

-- @statement
ALTER TABLE mentee_profiles
  ADD COLUMN experience_level VARCHAR(80) NULL AFTER goals,
  ADD COLUMN industry_preferences JSON NULL AFTER experience_level,
  ADD COLUMN education_status VARCHAR(120) NULL AFTER industry_preferences;

-- @statement
UPDATE mentee_profiles
SET industry_preferences = JSON_ARRAY()
WHERE industry_preferences IS NULL;

-- @statement
ALTER TABLE mentee_profiles
  MODIFY COLUMN industry_preferences JSON NOT NULL;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_get_by_email;

-- @statement
CREATE PROCEDURE sp_user_get_by_email(IN p_email VARCHAR(255))
BEGIN
  SELECT id, email, first_name, last_name, avatar_url, avatar_public_id, role, created_at
  FROM users
  WHERE email = p_email
  LIMIT 1;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_get_by_id;

-- @statement
CREATE PROCEDURE sp_user_get_by_id(IN p_id CHAR(36))
BEGIN
  SELECT id, email, first_name, last_name, avatar_url, avatar_public_id, role, created_at
  FROM users WHERE id = p_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_update_profile;

-- @statement
CREATE PROCEDURE sp_user_update_profile(
  IN p_id    CHAR(36),
  IN p_first VARCHAR(100),
  IN p_last  VARCHAR(100),
  IN p_role  VARCHAR(20)
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'USER_NOT_FOUND:User not found';
  END IF;

  UPDATE users
  SET
    first_name = p_first,
    last_name = p_last,
    role = p_role
  WHERE id = p_id;

  SELECT id, email, first_name, last_name, avatar_url, avatar_public_id, role, created_at
  FROM users
  WHERE id = p_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_update_avatar;

-- @statement
CREATE PROCEDURE sp_user_update_avatar(
  IN p_id               CHAR(36),
  IN p_avatar_url       VARCHAR(512),
  IN p_avatar_public_id VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'USER_NOT_FOUND:User not found';
  END IF;

  UPDATE users
  SET
    avatar_url = p_avatar_url,
    avatar_public_id = p_avatar_public_id
  WHERE id = p_id;

  SELECT id, email, first_name, last_name, avatar_url, avatar_public_id, role, created_at
  FROM users
  WHERE id = p_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_link_oauth_account;

-- @statement
CREATE PROCEDURE sp_auth_link_oauth_account(
  IN p_user_id          CHAR(36),
  IN p_provider         VARCHAR(20),
  IN p_provider_user_id VARCHAR(255),
  IN p_email            VARCHAR(255),
  IN p_email_verified   TINYINT(1)
)
BEGIN
  DECLARE v_id CHAR(36);

  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'USER_NOT_FOUND:User not found';
  END IF;

  SET v_id = UUID();

  INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, email, email_verified)
  VALUES (v_id, p_user_id, p_provider, p_provider_user_id, p_email, p_email_verified)
  ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    email = VALUES(email),
    email_verified = VALUES(email_verified);

  SELECT id, user_id, provider, provider_user_id, email, email_verified, created_at, updated_at
  FROM oauth_accounts
  WHERE provider = p_provider AND provider_user_id = p_provider_user_id
  LIMIT 1;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_get_oauth_account;

-- @statement
CREATE PROCEDURE sp_auth_get_oauth_account(
  IN p_provider VARCHAR(20),
  IN p_provider_user_id VARCHAR(255)
)
BEGIN
  SELECT
    oa.id,
    oa.user_id,
    oa.provider,
    oa.provider_user_id,
    oa.email,
    oa.email_verified,
    u.id AS linked_user_id,
    u.email AS linked_user_email
  FROM oauth_accounts oa
  INNER JOIN users u ON u.id = oa.user_id
  WHERE oa.provider = p_provider
    AND oa.provider_user_id = p_provider_user_id
  LIMIT 1;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_create_password_reset_token;

-- @statement
CREATE PROCEDURE sp_auth_create_password_reset_token(
  IN p_user_id CHAR(36),
  IN p_token_hash VARCHAR(255),
  IN p_expires_at TIMESTAMP
)
BEGIN
  DECLARE v_id CHAR(36);
  SET v_id = UUID();

  INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
  VALUES (v_id, p_user_id, p_token_hash, p_expires_at);

  SELECT id, user_id, token_hash, expires_at, used_at, created_at
  FROM password_reset_tokens
  WHERE id = v_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_get_password_reset_token;

-- @statement
CREATE PROCEDURE sp_auth_get_password_reset_token(IN p_token_hash VARCHAR(255))
BEGIN
  SELECT
    prt.id,
    prt.user_id,
    prt.token_hash,
    prt.expires_at,
    prt.used_at,
    prt.created_at,
    u.email,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.avatar_public_id,
    u.role,
    u.created_at AS user_created_at
  FROM password_reset_tokens prt
  INNER JOIN users u ON u.id = prt.user_id
  WHERE prt.token_hash = p_token_hash
  LIMIT 1;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_mark_password_reset_used;

-- @statement
CREATE PROCEDURE sp_auth_mark_password_reset_used(IN p_token_id CHAR(36))
BEGIN
  UPDATE password_reset_tokens
  SET used_at = CURRENT_TIMESTAMP
  WHERE id = p_token_id AND used_at IS NULL;

  SELECT id, user_id, token_hash, expires_at, used_at, created_at
  FROM password_reset_tokens
  WHERE id = p_token_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_auth_update_password_hash;

-- @statement
CREATE PROCEDURE sp_auth_update_password_hash(
  IN p_user_id CHAR(36),
  IN p_password_hash VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'USER_NOT_FOUND:User not found';
  END IF;

  INSERT INTO user_credentials (user_id, password_hash)
  VALUES (p_user_id, p_password_hash)
  ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash);

  SELECT user_id, password_hash, updated_at
  FROM user_credentials
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_upsert;

-- @statement
CREATE PROCEDURE sp_mentor_profile_upsert(
  IN p_user_id            CHAR(36),
  IN p_title              VARCHAR(140),
  IN p_bio                TEXT,
  IN p_experience_level   VARCHAR(80),
  IN p_industries         JSON,
  IN p_cv_url             VARCHAR(512),
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
    user_id, title, bio, experience_level, industries, cv_url, expertise, career_preferences, languages, availability
  ) VALUES (
    p_user_id, p_title, p_bio, p_experience_level, p_industries, p_cv_url, p_expertise, p_career_preferences, p_languages, p_availability
  )
  ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    bio = VALUES(bio),
    experience_level = VALUES(experience_level),
    industries = VALUES(industries),
    cv_url = VALUES(cv_url),
    expertise = VALUES(expertise),
    career_preferences = VALUES(career_preferences),
    languages = VALUES(languages),
    availability = VALUES(availability);

  SELECT user_id, title, bio, experience_level, industries, cv_url, expertise, career_preferences, languages, availability, updated_at
  FROM mentor_profiles
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_get_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentor_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, title, bio, experience_level, industries, cv_url, expertise, career_preferences, languages, availability, updated_at
  FROM mentor_profiles
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_delete_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentor_profile_delete_by_user_id(IN p_user_id CHAR(36))
BEGIN
  DELETE FROM mentor_profiles WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_upsert;

-- @statement
CREATE PROCEDURE sp_mentee_profile_upsert(
  IN p_user_id              CHAR(36),
  IN p_career_path          VARCHAR(120),
  IN p_goals                TEXT,
  IN p_experience_level     VARCHAR(80),
  IN p_industry_preferences JSON,
  IN p_education_status     VARCHAR(120),
  IN p_desired_skills       JSON,
  IN p_languages            JSON,
  IN p_availability         JSON
)
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND role = 'mentee') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'MENTEE_ROLE_REQUIRED:Signed-in user must have mentee role';
  END IF;

  INSERT INTO mentee_profiles (
    user_id, career_path, goals, experience_level, industry_preferences, education_status, desired_skills, languages, availability
  ) VALUES (
    p_user_id, p_career_path, p_goals, p_experience_level, p_industry_preferences, p_education_status, p_desired_skills, p_languages, p_availability
  )
  ON DUPLICATE KEY UPDATE
    career_path = VALUES(career_path),
    goals = VALUES(goals),
    experience_level = VALUES(experience_level),
    industry_preferences = VALUES(industry_preferences),
    education_status = VALUES(education_status),
    desired_skills = VALUES(desired_skills),
    languages = VALUES(languages),
    availability = VALUES(availability);

  SELECT user_id, career_path, goals, experience_level, industry_preferences, education_status, desired_skills, languages, availability, updated_at
  FROM mentee_profiles
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_get_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentee_profile_get_by_user_id(IN p_user_id CHAR(36))
BEGIN
  SELECT user_id, career_path, goals, experience_level, industry_preferences, education_status, desired_skills, languages, availability, updated_at
  FROM mentee_profiles
  WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_delete_by_user_id;

-- @statement
CREATE PROCEDURE sp_mentee_profile_delete_by_user_id(IN p_user_id CHAR(36))
BEGIN
  DELETE FROM mentee_profiles WHERE user_id = p_user_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentor_profile_list;

-- @statement
CREATE PROCEDURE sp_mentor_profile_list(
  IN p_limit INT,
  IN p_cursor_updated_at TIMESTAMP,
  IN p_cursor_id CHAR(36),
  IN p_search VARCHAR(255),
  IN p_language VARCHAR(80),
  IN p_expertise VARCHAR(80)
)
BEGIN
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.avatar_public_id,
    u.role,
    mp.title,
    mp.bio,
    mp.experience_level,
    mp.industries,
    mp.cv_url,
    mp.expertise,
    mp.career_preferences,
    mp.languages,
    mp.availability,
    mp.updated_at
  FROM mentor_profiles mp
  INNER JOIN users u ON u.id = mp.user_id
  WHERE u.role = 'mentor'
    AND (
      p_search IS NULL OR p_search = '' OR
      u.first_name LIKE CONCAT('%', p_search, '%') OR
      u.last_name LIKE CONCAT('%', p_search, '%') OR
      u.email LIKE CONCAT('%', p_search, '%') OR
      mp.title LIKE CONCAT('%', p_search, '%') OR
      mp.bio LIKE CONCAT('%', p_search, '%')
    )
    AND (
      p_language IS NULL OR p_language = '' OR
      JSON_CONTAINS(mp.languages, JSON_QUOTE(p_language))
    )
    AND (
      p_expertise IS NULL OR p_expertise = '' OR
      JSON_CONTAINS(mp.expertise, JSON_QUOTE(p_expertise))
    )
    AND (
      p_cursor_updated_at IS NULL OR
      mp.updated_at < p_cursor_updated_at OR
      (mp.updated_at = p_cursor_updated_at AND u.id < p_cursor_id)
    )
  ORDER BY mp.updated_at DESC, u.id DESC
  LIMIT p_limit;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_mentee_profile_list;

-- @statement
CREATE PROCEDURE sp_mentee_profile_list(
  IN p_limit INT,
  IN p_cursor_updated_at TIMESTAMP,
  IN p_cursor_id CHAR(36),
  IN p_search VARCHAR(255),
  IN p_language VARCHAR(80),
  IN p_skill VARCHAR(80)
)
BEGIN
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.avatar_public_id,
    u.role,
    mt.career_path,
    mt.goals,
    mt.experience_level,
    mt.industry_preferences,
    mt.education_status,
    mt.desired_skills,
    mt.languages,
    mt.availability,
    mt.updated_at
  FROM mentee_profiles mt
  INNER JOIN users u ON u.id = mt.user_id
  WHERE u.role = 'mentee'
    AND (
      p_search IS NULL OR p_search = '' OR
      u.first_name LIKE CONCAT('%', p_search, '%') OR
      u.last_name LIKE CONCAT('%', p_search, '%') OR
      u.email LIKE CONCAT('%', p_search, '%') OR
      mt.career_path LIKE CONCAT('%', p_search, '%') OR
      mt.goals LIKE CONCAT('%', p_search, '%')
    )
    AND (
      p_language IS NULL OR p_language = '' OR
      JSON_CONTAINS(mt.languages, JSON_QUOTE(p_language))
    )
    AND (
      p_skill IS NULL OR p_skill = '' OR
      JSON_CONTAINS(mt.desired_skills, JSON_QUOTE(p_skill))
    )
    AND (
      p_cursor_updated_at IS NULL OR
      mt.updated_at < p_cursor_updated_at OR
      (mt.updated_at = p_cursor_updated_at AND u.id < p_cursor_id)
    )
  ORDER BY mt.updated_at DESC, u.id DESC
  LIMIT p_limit;
END;
