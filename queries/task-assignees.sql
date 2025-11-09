-- 1. Assign a user to a task
-- ? = task_id, user_id
INSERT INTO task_assignees (task_id, user_id) 
VALUES (?, ?);

-- 2. Get all assignees for a task
-- ? = task_id
SELECT 
  u.id AS user_id,
  u.full_name
FROM task_assignees ta
JOIN users u ON ta.user_id = u.id
WHERE ta.task_id = ?;

-- 3. Remove an assignee from a task
-- ? = task_id, ? = user_id
DELETE FROM task_assignees 
WHERE task_id = ? AND user_id = ?;