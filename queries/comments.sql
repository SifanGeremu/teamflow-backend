-- 1. Add a new comment to a task
-- ? = id, task_id, user_id, message
INSERT INTO comments (id, task_id, user_id, message) 
VALUES (?, ?, ?, ?);

-- 2. List all comments for a task (with user names)
-- ? = task_id
SELECT 
  c.id, 
  c.message, 
  c.created_at,
  u.full_name AS user_name
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.task_id = ? 
ORDER BY c.created_at ASC;

-- 3. Delete a comment (e.g., admin only later)
-- ? = id
DELETE FROM comments 
WHERE id = ?;