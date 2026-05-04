# TaskFlow - Team Task Manager

A full-stack team task management application with role-based access control, Kanban boards, and real-time dashboards.

> **Demo Credentials:**
> | Role | Email | Password |
> |------|-------|----------|
> | Admin | admin@demo.com | demo1234 |
> | Member | member@demo.com | demo1234 |

---

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS v4 |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB (Mongoose ODM)                      |
| Auth       | JWT · httpOnly cookie (primary) + localStorage fallback |
| DnD        | @hello-pangea/dnd                           |
| Deployment | Vercel (frontend) + Render (backend)        |

---

## Features

- **Authentication** - Signup/Login with bcrypt hashing; JWT stored in httpOnly cookie (XSS-safe); localStorage used as fallback for non-browser clients; session restored on reload via `/auth/me`
- **Projects** - Create projects; creator becomes Admin automatically; paginated list (9/page)
- **Team Management** - Add/remove members with Admin or Member roles
- **Task Board** - Drag-and-drop Kanban (To Do / In Progress / Completed) with horizontal scroll on mobile
- **Role-based Access** - Admins manage everything; Members update status of their own tasks only
- **Dashboard** - Stats cards (total, completed, in-progress, to-do, overdue) + filterable task table; auto-refreshes every 30 s
- **Overdue Detection** - Tasks past due date flagged in red
- **Toast Feedback** - Success/error toasts on every action via react-hot-toast
- **Loading Skeletons** - Smooth loading states throughout the UI
- **Responsive UI** - Mobile hamburger sidebar, tablet and desktop layouts

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/esh-dev257/task-manage.git
cd task-manage
```

### 2. Backend setup

```bash
cd server
cp .env.example .env   # Windows: copy .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run dev       # starts on http://localhost:5000
```

### 3. Seed demo data

```bash
cd server
npm run seed
```

### 4. Frontend setup

```bash
cd client
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev       # starts on http://localhost:5173
```

---

## API Documentation

### Authentication

| Method | Endpoint            | Description                        | Auth |
| ------ | ------------------- | ---------------------------------- | ---- |
| POST   | `/api/auth/signup`  | Register; sets httpOnly auth cookie | No  |
| POST   | `/api/auth/login`   | Login; sets httpOnly auth cookie   | No   |
| GET    | `/api/auth/me`      | Restore session from cookie        | Yes  |
| POST   | `/api/auth/logout`  | Clear auth cookie                  | Yes  |

**Signup/Login body:** `{ name?, email, password }`  
**Response:** `{ token, user }`  
**Cookie:** `token` httpOnly; `SameSite=None; Secure` in production

---

### Projects

| Method | Endpoint                            | Description              | Role       |
| ------ | ----------------------------------- | ------------------------ | ---------- |
| GET    | `/api/projects`                     | List user's projects     | Any member |
| POST   | `/api/projects`                     | Create project           | Any user   |
| GET    | `/api/projects/:id`                 | Project detail + members | Member     |
| POST   | `/api/projects/:id/members`         | Add member               | Admin      |
| DELETE | `/api/projects/:id/members/:userId` | Remove member            | Admin      |

**Query params:** `?page=1&limit=9`  
**Create body:** `{ name, description? }`  
**Member body:** `{ email, role: "admin"|"member" }`

---

### Tasks

| Method | Endpoint                   | Description             | Role                                |
| ------ | -------------------------- | ----------------------- | ----------------------------------- |
| GET    | `/api/tasks/dashboard`     | Dashboard stats + tasks | Any                                 |
| GET    | `/api/tasks?projectId=xxx` | Tasks for a project     | Member                              |
| POST   | `/api/tasks`               | Create task             | Admin                               |
| PUT    | `/api/tasks/:id`           | Update task             | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id`           | Delete task             | Admin                               |

**Query params:** `?projectId=xxx&page=1&limit=50&status=todo&priority=high`  
**Create/Update body:** `{ title, description?, projectId, assignedTo?, priority, dueDate?, status?, attachmentUrl? }`

---

## Folder Structure

```
.
├── server/
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic (auth, project, task)
│   ├── middleware/   # JWT guard (cookie + header), role guard
│   ├── models/       # User, Project, Task (Mongoose)
│   ├── routes/       # auth, projects, tasks
│   ├── seed.js       # Demo data seeder
│   └── server.js     # Entry: CORS, cookie-parser, routes
└── client/
    └── src/
        ├── components/  # Layout, TaskCard, Skeleton
        ├── context/     # AuthContext (cookie-based session)
        ├── lib/         # Axios instance (withCredentials + Bearer fallback)
        ├── pages/       # Login, Signup, Dashboard, Projects, ProjectDetail, NewTask
        └── types/       # TypeScript interfaces
```

---

## Deployment

### Backend (Render)

1. New service → GitHub repo → root directory: `server`
2. Set environment variables:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - any long random string
   - `CLIENT_URL` - your Vercel frontend URL
   - `NODE_ENV=production`
3. Build: `npm install` · Start: `node server.js`

### Frontend (Vercel)

1. New project → same repo → root directory: `client`
2. Set environment variable:
   - `VITE_API_URL` - `https://your-backend.onrender.com/api`

> **Note:** `NODE_ENV=production` enables `SameSite=None; Secure` on the auth cookie, required for cross-origin cookies between Vercel and Render.

---

## Environment Variables

### Server (`server/.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Known Limitations

- No real-time updates (auto-poll every 30 s; refresh to see others' changes instantly)
- No email verification on signup
- No file upload (attachment is a URL field only)

---

## Demo Video

[Watch the demo video](https://your-video-link.com) _(add after recording)_
