-- Register: Insert new user

INSERT INTO users (id, full_name, email, password_hash) 
VALUES (?, ?, ?, ?);

-- Login: Find user by email

SELECT id, full_name, email, password_hash 
FROM users 
WHERE email = ? 
LIMIT 1;