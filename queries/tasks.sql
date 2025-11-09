-- 1. Create a new task in a team
-- ? = id, team_id, title, description, status, due_date
INSERT INTO tasks (id, team_id, title, description, status, due_date) 
VALUES (?, ?, ?, ?, ?, ?);

-- 2. List all tasks in a specific team
-- ? = team_id
SELECT 
  id, 
  title, 
  description, 
  status, 
  due_date, 
  created_at
FROM tasks 
WHERE team_id = ? 
ORDER BY created_at DESC;

-- 3. Update a task (e.g., change status or description)
-- ? = title, description, status, due_date, id
UPDATE tasks 
SET 
  title = ?, 
  description = ?, 
  status = ?, 
  due_date = ? 
WHERE id = ?;