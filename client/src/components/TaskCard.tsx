import { Calendar, User, AlertCircle } from 'lucide-react';
import type { Task } from '../types';

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-green-100 text-green-700',
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isAdmin?: boolean;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, isAdmin, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {onStatusChange ? (
          <select
            value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value as Task['status'])}
            className={`text-xs px-2 py-0.5 rounded-full font-medium border-0 cursor-pointer ${statusColors[task.status]}`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User size={12} />
          <span>{task.assignedTo?.name ?? 'Unassigned'}</span>
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            {isOverdue && <AlertCircle size={12} />}
            <Calendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(task._id)}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}
