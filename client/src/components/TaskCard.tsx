import { Calendar, User, AlertCircle, Trash2, Paperclip } from 'lucide-react';
import type { Task } from '../types';

const priorityStyles = {
  high:   { background: 'rgba(239,68,68,0.15)',  color: '#fca5a5' },
  medium: { background: 'rgba(251,191,36,0.15)', color: '#fde68a' },
  low:    { background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' },
};

const statusStyles = {
  'todo':        { background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' },
  'in-progress': { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  'completed':   { background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' },
};

const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' };

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isAdmin?: boolean;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, isAdmin, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="rounded-xl p-4 space-y-3 transition-all hover:-translate-y-0.5" style={{ background: 'rgba(30,10,60,0.8)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug">{task.title}</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0" style={priorityStyles[task.priority]}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-purple-400 line-clamp-2">{task.description}</p>
      )}

      {task.attachmentUrl && (
        <a
          href={task.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200 transition-colors truncate"
          onClick={e => e.stopPropagation()}
        >
          <Paperclip size={11} />
          <span className="truncate">Attachment</span>
        </a>
      )}

      <div>
        {onStatusChange ? (
          <select
            value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value as Task['status'])}
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold border-0 cursor-pointer outline-none"
            style={statusStyles[task.status]}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={statusStyles[task.status]}>
            {statusLabels[task.status]}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-purple-400 pt-1" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
        <div className="flex items-center gap-1">
          <User size={11} />
          <span>{task.assignedTo?.name ?? 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              {isOverdue && <AlertCircle size={11} />}
              <Calendar size={11} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {isAdmin && onDelete && (
            <button onClick={() => onDelete(task._id)} className="text-purple-600 hover:text-red-400 transition-colors">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
