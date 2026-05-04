================================================================================
                        TaskFlow - Team Task Manager
================================================================================

A full-stack team task management application with role-based access control,
drag-and-drop Kanban boards, paginated lists, auto-refresh polling, file
attachments, and a fully responsive dark purple glassmorphism UI.

--------------------------------------------------------------------------------
LIVE DEMO
--------------------------------------------------------------------------------

Live URL    : https://task-manage-one-sigma.vercel.app
GitHub Repo : https://github.com/esh-dev257/task-manage

Demo Credentials (use the quick-fill buttons on the login page):
  Admin  -> admin@demo.com  / demo1234
  Member -> member@demo.com / demo1234

--------------------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------------------

  Frontend   : React 18, TypeScript, Vite, Tailwind CSS v4
  Backend    : Node.js, Express.js
  Database   : MongoDB (Mongoose ODM)
  Auth       : JWT -httpOnly cookie (primary) + localStorage Bearer token fallback
  DnD        : @hello-pangea/dnd (drag-and-drop Kanban)
  Deployment : Vercel (frontend) + Render (backend)

--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

  Authentication
    - Signup / Login with bcrypt password hashing
    - JWT stored in httpOnly cookie (XSS-safe); localStorage Bearer token fallback
    - Session restore on page reload via /auth/me (cookie-based)
    - Logout clears server cookie + localStorage
    - Password show/hide toggle; demo quick-fill buttons on login page

  Projects
    - Create projects; creator is automatically assigned Admin role
    - Paginated list (9 per page) with Prev / Next controls
    - Add / remove team members with Admin or Member roles

  Tasks
    - Create, update, delete tasks (Admin only for create/delete)
    - Drag-and-drop Kanban board (To Do → In Progress → Completed)
    - Paginated task list (50 per page) per project
    - Filter tasks by status and priority
    - File attachment URL per task (shown as paperclip link in task card)
    - Overdue detection -tasks past due date highlighted in red

  Dashboard
    - Stats cards: Total / Completed / In Progress / To Do / Overdue
    - Filterable recent-tasks table
    - Overdue panel with inline status change
    - Auto-refreshes silently every 30 seconds

  Real-time Updates
    - Dashboard and Project Detail auto-poll every 30 s in the background
    - No manual page refresh needed to see teammates' changes

  UI / UX
    - Fully responsive -mobile, tablet, desktop
    - Mobile hamburger sidebar with smooth slide-in overlay animation
    - Dark deep-purple glassmorphism theme throughout
    - Auth pages: split-panel layout with large blob background decorations,
      pill-shaped inputs, icon-prefixed fields, eye toggle, vibrant
      purple→fuchsia gradient CTA button (inspired by modern finance app UI)
    - Horizontal Kanban scroll on mobile
    - Toast notifications on every action
    - Loading skeletons for smooth perceived performance

--------------------------------------------------------------------------------
UI THEME REFERENCE
--------------------------------------------------------------------------------

  Colour palette:
    Background  #08011a  (deep purple-black)
    Primary     #7c3aed  (violet-600)
    Accent      #d946ef  (fuchsia-500)
    Card        rgba(255,255,255,0.06) frosted glass
    Text        white / purple-300 / purple-500

  Design elements:
    - Pill-shaped inputs (border-radius: 50px) with icon prefix
    - Gradient CTA button: violet → purple → fuchsia, pill-shaped
    - Large blurred radial-gradient blobs as background decoration
    - Glassmorphism cards (backdrop-filter: blur)
    - Accent border glow on hover / active states

--------------------------------------------------------------------------------
LOCAL SETUP
--------------------------------------------------------------------------------

Prerequisites: Node.js 18+, MongoDB Atlas account (or local MongoDB)

1. Clone the repo
   git clone https://github.com/esh-dev257/task-manage.git
   cd task-manage

2. Backend
   cd server
   copy .env.example .env          (Windows)
   cp  .env.example .env           (Mac/Linux)
   # Edit .env with MONGO_URI, JWT_SECRET, CLIENT_URL
   npm install
   npm run dev        -> http://localhost:5000

3. Seed demo data (optional)
   npm run seed

4. Frontend
   cd ../client
   copy .env.example .env
   # Edit: VITE_API_URL=http://localhost:5000/api
   npm install
   npm run dev        -> http://localhost:5173

--------------------------------------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------------------------------------

Server (server/.env):
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=your_secret_key_here
  PORT=5000
  CLIENT_URL=http://localhost:5173   (Vercel URL in production)
  NODE_ENV=development               (set "production" on Render)

Client (client/.env):
  VITE_API_URL=http://localhost:5000/api

--------------------------------------------------------------------------------
API DOCUMENTATION
--------------------------------------------------------------------------------

AUTH ENDPOINTS
  POST   /api/auth/signup    Register -sets httpOnly cookie         (public)
  POST   /api/auth/login     Login -sets httpOnly cookie            (public)
  GET    /api/auth/me        Restore session from cookie             (protected)
  POST   /api/auth/logout    Clear auth cookie                       (protected)

  Body:  { name?, email, password }
  Resp:  { token, user }
  Cookie: "token" httpOnly; SameSite=None + Secure in production

PROJECT ENDPOINTS
  GET    /api/projects                      List (paginated)         (member)
  POST   /api/projects                      Create                   (any)
  GET    /api/projects/:id                  Detail + members         (member)
  POST   /api/projects/:id/members          Add member               (admin)
  DELETE /api/projects/:id/members/:userId  Remove member            (admin)

  List response : { projects, total, page, pages }
  Query params  : ?page=1&limit=9
  Create body   : { name, description? }
  Member body   : { email, role: "admin"|"member" }

TASK ENDPOINTS
  GET    /api/tasks/dashboard     Stats + overdue + recent           (protected)
  GET    /api/tasks               List for project (paginated)       (member)
  POST   /api/tasks               Create                             (admin)
  PUT    /api/tasks/:id           Update (admin: all / member: status only)
  DELETE /api/tasks/:id           Delete                             (admin)

  List query  : ?projectId=xxx&page=1&limit=50&status=todo&priority=high
  List resp   : { tasks, total, page, pages }
  Create/Update body:
    { title, description?, projectId, assignedTo?, priority,
      dueDate?, status?, attachmentUrl? }

--------------------------------------------------------------------------------
ROLE-BASED ACCESS CONTROL
--------------------------------------------------------------------------------

  Admin  : Create/delete projects, add/remove members,
           create/delete/assign tasks, update all task fields
  Member : View projects they belong to,
           update status of tasks assigned to them only

  Unauthorized requests return 403 Forbidden.

--------------------------------------------------------------------------------
FOLDER STRUCTURE
--------------------------------------------------------------------------------

  /
  ├── server/
  │   ├── config/         DB connection (db.js)
  │   ├── controllers/    auth, project, task
  │   ├── middleware/     JWT guard (cookie + header), project role guard
  │   ├── models/         User, Project, Task (Mongoose)
  │   ├── routes/         auth, projects, tasks
  │   ├── seed.js         Demo data seeder
  │   └── server.js       Entry: CORS, cookie-parser, routes
  └── client/
      └── src/
          ├── components/ Layout (responsive sidebar), TaskCard,
          │               StatCard, Skeleton
          ├── context/    AuthContext (cookie-based session)
          ├── lib/        Axios (withCredentials + Bearer fallback)
          ├── pages/      Login, Signup, Dashboard, Projects,
          │               ProjectDetail (Kanban), NewTask
          └── types/      User, Project, Task, DashboardData

--------------------------------------------------------------------------------
DEPLOYMENT
--------------------------------------------------------------------------------

Backend on Render:
  Root Directory : server
  Build Command  : npm install
  Start Command  : node server.js
  Env vars       : MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production

Frontend on Vercel:
  Root Directory : client
  Env var        : VITE_API_URL=https://your-backend.onrender.com/api

IMPORTANT: NODE_ENV=production enables SameSite=None + Secure on the auth
cookie, which is required for cross-origin cookies between Vercel and Render.
Both services deploy from the same GitHub repo using different Root Directories.

================================================================================
