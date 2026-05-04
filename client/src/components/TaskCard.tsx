import { Calendar, User, AlertCircle, Trash2, Paperclip } from 'lucide-react';
import type { Task } from '../types';

const priorityStyles = {
  high:   { background: 'rgba(239,68,68,0.1)',  color: '#dc2626' },
  medium: { background: 'rgba(245,158,11,0.1)', color: '#d97706' },
  low:    { background: 'rgba(34,197,94,0.1)',  color: '#16a34a' },
};

const statusStyles = {
  'todo':        { background: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
  'in-progress': { background: 'rgba(59,130,246,0.1)',  color: '#2563eb' },
  'completed':   { background: 'rgba(16,185,129,0.1)',  color: '#059669' },
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
    <div className="rounded-xl p-4 space-y-3 transition-all hover:-translate-y-0.5" style={{ background: '#ffffff', border: '1px solid #ede9fe', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.06)')}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug" style={{ color: '#1e1038' }}>{task.title}</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={priorityStyles[task.priority]}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs line-clamp-2" style={{ color: '#a78bfa' }}>{task.description}</p>
      )}

      {task.attachmentUrl && (
        <a
          href={task.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs transition-colors truncate"
          style={{ color: '#7c3aed' }}
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

      <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1px solid #f0ebff', color: '#a78bfa' }}>
        <div className="flex items-center gap-1">
          <User size={11} />
          <span>{task.assignedTo?.name ?? 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              {isOverdue && <AlertCircle size={11} />}
              <Calendar size={11} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {isAdmin && onDelete && (
            <button onClick={() => onDelete(task._id)} className="transition-colors hover:text-red-500" style={{ color: '#c4b5fd' }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
