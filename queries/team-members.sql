-- 1. Add a member to a team (creator becomes ADMIN, others MEMBER)
-- ? = id, team_id, user_id, role
INSERT INTO team_members (id, team_id, user_id, role) 
VALUES (?, ?, ?, ?);

-- 2. Get a user's role in a specific team
-- ? = user_id, ? = team_id
SELECT role 
FROM team_members 
WHERE user_id = ? AND team_id = ? 
LIMIT 1;

-- 3. Remove a member from a team (leave / kick)
-- ? = team_id, ? = user_id
DELETE FROM team_members 
WHERE team_id = ? AND user_id = ?;