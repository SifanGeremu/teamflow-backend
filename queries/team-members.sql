INSERT INTO team_members (id, team_id, user_id, role) VALUES (?, ?, ?, ?);

SELECT role FROM team_members WHERE user_id = ? AND team_id = ? LIMIT 1;

DELETE FROM team_members WHERE team_id = ? AND user_id = ?;