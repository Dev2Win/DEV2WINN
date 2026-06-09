CREATE PROCEDURE sp_auth_register(
  IN p_email         VARCHAR(255),
  IN p_first         VARCHAR(100),
  IN p_last          VARCHAR(100),
  IN p_role          VARCHAR(20),
  IN p_password_hash VARCHAR(255)
)
BEGIN
  DECLARE v_user_id CHAR(36);

  IF p_password_hash IS NULL OR CHAR_LENGTH(TRIM(p_password_hash)) = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'PASSWORD_REQUIRED:Password hash is required';
  END IF;

  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'EMAIL_TAKEN:Email already registered';
  END IF;

  START TRANSACTION;

  SET v_user_id = UUID();

  INSERT INTO users (id, email, first_name, last_name, role)
  VALUES (v_user_id, p_email, p_first, p_last, p_role);

  INSERT INTO user_credentials (user_id, password_hash)
  VALUES (v_user_id, p_password_hash);

  COMMIT;

  SELECT id, email, first_name, last_name, role, created_at
  FROM users
  WHERE id = v_user_id;
END;
