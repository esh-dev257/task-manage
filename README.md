# TaskFlow -Team Task Manager

A full-stack team task management application with role-based access control, Kanban boards, and real-time dashboards.


>
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
| Auth       | JWT (stored in localStorage)                |

---

## Features

- **Authentication** -Signup/Login with bcrypt password hashing and JWT
- **Projects** -Create projects; first creator becomes Admin automatically
- **Team Management** -Add/remove members with Admin or Member roles
- **Task Board** -Kanban columns (To Do / In Progress / Completed)
- **Role-based Access** -Admins manage everything; Members update their own task statuses
- **Dashboard** -Stats cards (total, completed, in-progress, to-do, overdue) + task table with filters
- **Overdue Detection** -Tasks past due date flagged in red on dashboard
- **Toast Notifications** -Success/error feedback on every action
- **Loading Skeletons** -Smooth loading states throughout the UI

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
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

| Method | Endpoint           | Description         | Auth |
| ------ | ------------------ | ------------------- | ---- |
| POST   | `/api/auth/signup` | Register a new user | No   |
| POST   | `/api/auth/login`  | Login and get JWT   | No   |
| GET    | `/api/auth/me`     | Get current user    | Yes  |

**Signup body:** `{ name, email, password }`  
**Login body:** `{ email, password }`  
**Response:** `{ token, user }`

---

### Projects

| Method | Endpoint                            | Description              | Role       |
| ------ | ----------------------------------- | ------------------------ | ---------- |
| GET    | `/api/projects`                     | List user's projects     | Any member |
| POST   | `/api/projects`                     | Create project           | Any user   |
| GET    | `/api/projects/:id`                 | Project detail + members | Member     |
| POST   | `/api/projects/:id/members`         | Add member               | Admin      |
| DELETE | `/api/projects/:id/members/:userId` | Remove member            | Admin      |

**Create project body:** `{ name, description? }`  
**Add member body:** `{ email, role: "admin"|"member" }`

---

### Tasks

| Method | Endpoint                   | Description             | Role                                |
| ------ | -------------------------- | ----------------------- | ----------------------------------- |
| GET    | `/api/tasks/dashboard`     | Dashboard stats + tasks | Any                                 |
| GET    | `/api/tasks?projectId=xxx` | Tasks for a project     | Member                              |
| POST   | `/api/tasks`               | Create task             | Admin                               |
| PUT    | `/api/tasks/:id`           | Update task             | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id`           | Delete task             | Admin                               |

**Create task body:** `{ title, description?, projectId, assignedTo?, priority, dueDate?, status? }`

---

## Folder Structure

```
.
├── server/
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & role guards
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   ├── seed.js       # Demo data seeder
│   └── server.js     # App entry point
└── client/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # React context (Auth)
        ├── lib/         # Axios instance
        ├── pages/       # Route pages
        └── types/       # TypeScript interfaces
```

---

## Deployment (Railway)

### Backend

1. Create a new Railway project → **New Service → GitHub Repo → `/server` folder**
2. Set environment variables:
   - `MONGO_URI` -your MongoDB Atlas connection string
   - `JWT_SECRET` -any long random string
   - `CLIENT_URL` -your frontend Railway URL
3. Deploy; Railway auto-detects Node.js via `railway.json`

### Frontend

1. Add another service → select same repo → **Root Directory: `/client`**
2. Set environment variable:
   - `VITE_API_URL` -`https://your-backend.railway.app/api`
3. Deploy; Vite build runs automatically

---

## Environment Variables

### Server (`server/.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Known Limitations

- No real-time updates (WebSocket/SSE not implemented; refresh to see others' changes)
- JWT stored in localStorage (not httpOnly cookie -acceptable for this scope)
- No email verification on signup
- No pagination on task/project lists
- No file attachments on tasks

---

## Demo Video

[Watch the demo video](https://your-video-link.com) _(add after recording)_
