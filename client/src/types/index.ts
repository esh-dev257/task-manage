export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ProjectMember {
  user: User;
  role: 'admin' | 'member';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: User;
  members: ProjectMember[];
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: { _id: string; name: string };
  assignedTo: User | null;
  createdBy: User;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  attachmentUrl: string;
  createdAt: string;
}

export interface DashboardData {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
  };
  overdueTasks: Task[];
  recentTasks: Task[];
}
