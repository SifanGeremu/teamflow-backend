INSERT INTO teams (id, name, created_by) VALUES (?, ?, ?);

SELECT 
  t.id, 
  t.name, 
  t.created_at,
  tm.role
FROM teams t
JOIN team_members tm ON t.id = tm.team_id
WHERE tm.user_id = ?
ORDER BY t.created_at DESC;