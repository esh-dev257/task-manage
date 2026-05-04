================================================================================
                        TaskFlow - Team Task Manager
================================================================================

A full-stack team task management application with role-based access control,
drag-and-drop Kanban boards, paginated project/task lists, auto-refresh polling,
file attachment support, and a fully responsive dark purple UI.

--------------------------------------------------------------------------------
LIVE DEMO
--------------------------------------------------------------------------------

Live URL    : https://task-manage-one-sigma.vercel.app
GitHub Repo : https://github.com/esh-dev257/task-manage

Demo Credentials:
  Admin  -> admin@demo.com  / demo1234
  Member -> member@demo.com / demo1234

--------------------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------------------

  Frontend   : React 18, TypeScript, Vite, Tailwind CSS v4
  Backend    : Node.js, Express.js
  Database   : MongoDB (Mongoose ODM)
  Auth       : JWT — httpOnly cookie (primary) + localStorage Bearer token fallback
  Deployment : Vercel (frontend) + Render (backend)

--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

  Authentication
    - Signup / Login with bcrypt password hashing
    - JWT stored in httpOnly cookie (XSS-safe); localStorage fallback for API clients
    - Session restore on page reload via /auth/me (cookie-based)
    - Secure logout clears server cookie and localStorage

  Projects
    - Create projects; creator is automatically assigned Admin role
    - Paginated project list (9 per page) with Prev / Next controls
    - Add / remove team members with Admin or Member roles

  Tasks
    - Create, update, delete tasks (Admin only for create/delete)
    - Drag-and-drop Kanban board (To Do / In Progress / Completed)
    - Paginated task list (50 per page) per project
    - Filter tasks by status and priority
    - File attachment URL on each task (shown as clickable link in task card)
    - Overdue detection — tasks past due date flagged in red

  Dashboard
    - Stats cards: Total / Completed / In Progress / To Do / Overdue
    - Filterable recent-tasks table (All / To Do / In Progress / Completed)
    - Overdue task panel with inline status change
    - Auto-refreshes silently every 30 seconds

  Real-time Updates
    - Dashboard and project detail auto-poll every 30 s in the background
    - No page refresh needed to see teammates' changes

  UI / UX
    - Fully responsive — works on mobile, tablet, and desktop
    - Mobile hamburger sidebar with smooth slide animation
    - Dark purple glassmorphism theme throughout
    - Horizontal Kanban scroll on mobile
    - Toast notifications on every action
    - Loading skeletons for smooth perceived performance
    - Password show/hide toggle on auth forms
    - Icon-prefixed inputs on login and signup

--------------------------------------------------------------------------------
LOCAL SETUP
--------------------------------------------------------------------------------

Prerequisites:
  - Node.js 18+
  - MongoDB Atlas account (or local MongoDB)

1. Clone the repository
   git clone https://github.com/esh-dev257/task-manage.git
   cd task-manage

2. Backend setup
   cd server
   copy .env.example .env          (Windows)
   cp  .env.example .env           (Mac/Linux)
   Edit .env with your MONGO_URI, JWT_SECRET, CLIENT_URL
   npm install
   npm run dev        -> starts on http://localhost:5000

3. Seed demo data (optional)
   cd server
   npm run seed

4. Frontend setup
   cd client
   copy .env.example .env          (Windows)
   cp  .env.example .env           (Mac/Linux)
   Edit .env: VITE_API_URL=http://localhost:5000/api
   npm install
   npm run dev        -> starts on http://localhost:5173

--------------------------------------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------------------------------------

Server (server/.env):
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=your_secret_key_here
  PORT=5000
  CLIENT_URL=http://localhost:5173   (or your Vercel URL in production)
  NODE_ENV=development               (set to "production" on Render)

Client (client/.env):
  VITE_API_URL=http://localhost:5000/api

--------------------------------------------------------------------------------
API DOCUMENTATION
--------------------------------------------------------------------------------

AUTH ENDPOINTS
  POST   /api/auth/signup          Register a new user             (public)
  POST   /api/auth/login           Login — sets httpOnly cookie     (public)
  GET    /api/auth/me              Get current user from cookie     (protected)
  POST   /api/auth/logout          Clear auth cookie               (protected)

  Signup / Login body : { name?, email, password }
  Response            : { token, user }
  Cookie              : "token" (httpOnly, SameSite=None in production)

PROJECT ENDPOINTS
  GET    /api/projects                      List projects (paginated)    (member)
  POST   /api/projects                      Create a project             (any)
  GET    /api/projects/:id                  Project detail + members     (member)
  POST   /api/projects/:id/members          Add a member                 (admin)
  DELETE /api/projects/:id/members/:userId  Remove a member              (admin)

  List response     : { projects, total, page, pages }
  Query params      : ?page=1&limit=9
  Create body       : { name, description? }
  Add member body   : { email, role: "admin"|"member" }

TASK ENDPOINTS
  GET    /api/tasks/dashboard      Dashboard stats + task lists         (protected)
  GET    /api/tasks?projectId=xxx  Tasks for a project (paginated)      (member)
  POST   /api/tasks                Create a task                        (admin)
  PUT    /api/tasks/:id            Update task (admin: full / member: status only)
  DELETE /api/tasks/:id            Delete a task                        (admin)

  List query params  : ?projectId=xxx&page=1&limit=50&status=todo&priority=high
  List response      : { tasks, total, page, pages }
  Create / Update body:
    { title, description?, projectId, assignedTo?, priority,
      dueDate?, status?, attachmentUrl? }

--------------------------------------------------------------------------------
ROLE-BASED ACCESS CONTROL
--------------------------------------------------------------------------------

  Admin  : Create/delete projects, add/remove members,
           create/delete/assign tasks, update all task fields
  Member : View projects they belong to,
           update status of tasks assigned to them only

  Any request outside these permissions returns 403 Forbidden.

--------------------------------------------------------------------------------
FOLDER STRUCTURE
--------------------------------------------------------------------------------

  /
  ├── server/
  │   ├── config/         DB connection (db.js)
  │   ├── controllers/    Business logic (auth, project, task)
  │   ├── middleware/     JWT auth guard (cookie + header), project role guard
  │   ├── models/         Mongoose schemas (User, Project, Task)
  │   ├── routes/         Express routers (auth, projects, tasks)
  │   ├── seed.js         Demo data seeder
  │   └── server.js       App entry point (CORS, cookie-parser, routes)
  └── client/
      └── src/
          ├── components/ Layout (responsive sidebar), TaskCard, StatCard, Skeleton
          ├── context/    AuthContext — cookie-based session restore
          ├── lib/        Axios instance (withCredentials, Bearer fallback)
          ├── pages/      Login, Signup, Dashboard, Projects,
          │               ProjectDetail (Kanban), NewTask
          └── types/      TypeScript interfaces (User, Project, Task, Dashboard)

--------------------------------------------------------------------------------
DEPLOYMENT
--------------------------------------------------------------------------------

Backend (Render):
  1. New Web Service -> GitHub repo -> Root Directory: server
  2. Build Command : npm install
  3. Start Command : node server.js
  4. Environment variables:
       MONGO_URI   = mongodb+srv://...
       JWT_SECRET  = your_secret
       CLIENT_URL  = https://your-app.vercel.app
       NODE_ENV    = production

Frontend (Vercel):
  1. Import GitHub repo -> Root Directory: client
  2. Environment variable:
       VITE_API_URL = https://your-backend.onrender.com/api
  3. Deploy — Vercel auto-runs Vite build

Notes:
  - NODE_ENV=production sets cookie SameSite=None + Secure, required for
    cross-origin httpOnly cookies between Vercel and Render domains.
  - Both services deploy from the same GitHub repo using different Root Directories.

================================================================================
