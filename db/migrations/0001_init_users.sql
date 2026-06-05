-- Migration 0001 — users table + user procedures.
-- Statements are separated by the `-- @statement` delimiter (see server/src/db/migrate.ts).
-- Procedures are the ONLY sanctioned data path; app code calls them via repositories.

-- @statement
CREATE TABLE IF NOT EXISTS users (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  email       VARCHAR(255) NOT NULL,
  first_name  VARCHAR(100) NULL,
  last_name   VARCHAR(100) NULL,
  role        ENUM('mentee', 'mentor', 'admin') NOT NULL DEFAULT 'mentee',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_create;

-- @statement
CREATE PROCEDURE sp_user_create(
  IN p_email VARCHAR(255),
  IN p_first VARCHAR(100),
  IN p_last  VARCHAR(100),
  IN p_role  VARCHAR(20)
)
BEGIN
  DECLARE v_id CHAR(36);

  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'EMAIL_TAKEN:Email already registered';
  END IF;

  SET v_id = UUID();
  INSERT INTO users (id, email, first_name, last_name, role)
  VALUES (v_id, p_email, p_first, p_last, p_role);

  SELECT id, email, first_name, last_name, role, created_at
  FROM users WHERE id = v_id;
END;

-- @statement
DROP PROCEDURE IF EXISTS sp_user_get_by_id;

-- @statement
CREATE PROCEDURE sp_user_get_by_id(IN p_id CHAR(36))
BEGIN
  SELECT id, email, first_name, last_name, role, created_at
  FROM users WHERE id = p_id;
END;
