CREATE PROCEDURE sp_auth_get_login_by_email(IN p_email VARCHAR(255))
BEGIN
  SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.created_at,
    uc.password_hash
  FROM users u
  INNER JOIN user_credentials uc ON uc.user_id = u.id
  WHERE u.email = p_email
  LIMIT 1;
END;
