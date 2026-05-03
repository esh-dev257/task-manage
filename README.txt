================================================================================
                        TaskFlow - Team Task Manager
================================================================================

A full-stack team task management application with role-based access control,
Kanban boards, and real-time dashboards.

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
  Auth       : JWT (stored in localStorage)
  Deployment : Vercel (frontend) + Render (backend)

--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

  - Authentication       : Signup/Login with bcrypt hashing and JWT
  - Projects             : Create projects; creator becomes Admin automatically
  - Team Management      : Add/remove members with Admin or Member roles
  - Kanban Task Board    : Drag-and-drop columns (To Do / In Progress / Completed)
  - Role-based Access    : Admins manage everything; Members update their own tasks
  - Dashboard            : Stats cards (total, completed, in-progress, overdue)
                           + filterable task table
  - Overdue Detection    : Tasks past due date flagged in red
  - Toast Notifications  : Success/error feedback on every action
  - Loading Skeletons    : Smooth loading states throughout the UI
  - Dark Purple UI       : Full glassmorphism dark purple theme

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
   copy .env.example .env
   (Edit .env with your MONGO_URI and JWT_SECRET)
   npm install
   npm run dev        -> starts on http://localhost:5000

3. Seed demo data
   cd server
   npm run seed

4. Frontend setup
   cd client
   copy .env.example .env
   (Edit .env: VITE_API_URL=http://localhost:5000/api)
   npm install
   npm run dev        -> starts on http://localhost:5173

--------------------------------------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------------------------------------

Server (server/.env):
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=your_secret_key
  PORT=5000
  CLIENT_URL=http://localhost:5173

Client (client/.env):
  VITE_API_URL=http://localhost:5000/api

--------------------------------------------------------------------------------
API DOCUMENTATION
--------------------------------------------------------------------------------

AUTH ENDPOINTS
  POST   /api/auth/signup          Register a new user          (public)
  POST   /api/auth/login           Login and receive JWT        (public)
  GET    /api/auth/me              Get current user info        (protected)

  Signup body : { name, email, password }
  Login body  : { email, password }
  Response    : { token, user }

PROJECT ENDPOINTS
  GET    /api/projects                      List user's projects      (member)
  POST   /api/projects                      Create a project          (any)
  GET    /api/projects/:id                  Project detail + members  (member)
  POST   /api/projects/:id/members          Add a member              (admin)
  DELETE /api/projects/:id/members/:userId  Remove a member           (admin)

  Create project body : { name, description? }
  Add member body     : { email, role: "admin"|"member" }

TASK ENDPOINTS
  GET    /api/tasks/dashboard      Dashboard stats + tasks       (any)
  GET    /api/tasks?projectId=xxx  Tasks for a project           (member)
  POST   /api/tasks                Create a task                 (admin)
  PUT    /api/tasks/:id            Update task                   (admin: full / member: status only)
  DELETE /api/tasks/:id            Delete a task                 (admin)

  Create task body : { title, description?, projectId, assignedTo?,
                       priority, dueDate?, status? }

--------------------------------------------------------------------------------
FOLDER STRUCTURE
--------------------------------------------------------------------------------

  /
  ├── server/
  │   ├── config/         DB connection (db.js)
  │   ├── controllers/    Business logic (auth, project, task)
  │   ├── middleware/     JWT auth guard, project role guard
  │   ├── models/         Mongoose schemas (User, Project, Task)
  │   ├── routes/         Express routers (auth, projects, tasks)
  │   ├── seed.js         Demo data seeder
  │   └── server.js       App entry point
  └── client/
      └── src/
          ├── components/ Layout, TaskCard, StatCard, Skeleton
          ├── context/    Auth context (React)
          ├── lib/        Axios instance with JWT interceptor
          ├── pages/      Login, Signup, Dashboard, Projects,
          │               ProjectDetail, NewTask
          └── types/      TypeScript interfaces

--------------------------------------------------------------------------------
DEPLOYMENT
--------------------------------------------------------------------------------

Backend (Render):
  1. New Web Service -> GitHub repo -> Root Directory: server
  2. Build Command : npm install
  3. Start Command : node server.js
  4. Add environment variables: MONGO_URI, JWT_SECRET, CLIENT_URL

Frontend (Vercel):
  1. Import GitHub repo -> Root Directory: client
  2. Add environment variable: VITE_API_URL=https://your-backend.onrender.com/api
  3. Deploy -> Vercel auto-runs Vite build

--------------------------------------------------------------------------------
ROLE-BASED ACCESS CONTROL
--------------------------------------------------------------------------------

  Admin  : Create/delete projects, add/remove members,
           create/delete/assign tasks, update anything
  Member : View projects they belong to,
           update status of tasks assigned to them only

  Any request outside these permissions returns 403 Forbidden.

--------------------------------------------------------------------------------
KNOWN LIMITATIONS
--------------------------------------------------------------------------------

  - No real-time updates (refresh to see others' changes)
  - JWT stored in localStorage (not httpOnly cookie)
  - No email verification on signup
  - No pagination on task/project lists
  - No file attachments on tasks

