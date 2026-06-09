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

  SELECT id, email, first_name, last_name, role, created_at
  FROM users
  WHERE id = p_id;
END;
