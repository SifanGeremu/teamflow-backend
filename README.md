TeamFlow Backend

The heartbeat of real-time collaboration.

TeamFlow is a high-performance, real-time task management API. While many project management tools feel sluggish, TeamFlow is built for speed, using raw SQL queries for precision and WebSockets for instant updates. Whether you're moving a card on a Kanban board or assigning a high-priority bug, TeamFlow ensures everyone sees it the millisecond it happens.

Key Features

    Real-Time Everything: Powered by Socket.io, changes propagate to all team members instantly. No more refreshing the page to see if a task was completed.

    Granular Security (RBAC): Not everyone needs to delete a project. Our Role-Based Access Control ensures that Admins, Managers, and Members have exactly the permissions they need.

    Raw Performance: We skipped the heavy ORMs. By using Raw SQL, we keep database interactions lean, predictable, and lightning-fast.

    Secure Foundation: Industry-standard JWT (JSON Web Tokens) authentication keeps user data locked down and sessions seamless.
Layer,Technology,Why we chose it
Runtime,Node.js,Non-blocking I/O is perfect for real-time apps.
Framework,Express,Lightweight and unopinionated.
Database,MySQL,"Reliable, relational, and robust for complex task linking."
Querying,Raw SQL,Maximum control and optimized execution plans.
Real-time,Socket.io,Bidirectional communication with automatic reconnection.
🏗 System Architecture

The API is designed to handle a high volume of concurrent users by separating concerns between RESTful state changes and real-time event broadcasting.
🔒 Security Flow

    Authentication: User logs in → System verifies via bcrypt → Issues a signed JWT.

    Authorization: Middleware checks the user's role against the requested resource.

    Data Integrity: Raw SQL transactions ensure that task updates are atomic—nothing gets lost in the shuffle.
🏁 Getting Started (Quick Start)

    Clone the repo
    Bash

    git clone https://github.com/SifanGeremu/teamflow-backend/

    Install dependencies
    Bash

    npm install

    Configure Environment
    Create a .env file and add your DB_HOST, DB_USER, DB_PASS, and JWT_SECRET.

    Run the Engine
    Bash

    npm run dev

Coming Soon: Detailed API documentation for endpoints, including POST /tasks, PATCH /projects, and Socket event listeners.
