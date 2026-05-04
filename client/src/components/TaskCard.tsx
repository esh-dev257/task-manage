import { Calendar, User, AlertCircle, Trash2, Paperclip } from 'lucide-react';
import type { Task } from '../types';

const priorityBadge: Record<string, React.CSSProperties> = {
  high:   { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
  medium: { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
  low:    { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' },
};

const statusBadge: Record<string, React.CSSProperties> = {
  'todo':        { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' },
  'in-progress': { background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' },
  'completed':   { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' },
};

const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Done' };

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isAdmin?: boolean;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, isAdmin, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="rounded-xl p-3.5 space-y-2.5 transition-all hover:-translate-y-px"
      style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)')}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug" style={{ color: '#0F172A' }}>{task.title}</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 capitalize"
          style={priorityBadge[task.priority]}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs line-clamp-2" style={{ color: '#94A3B8' }}>{task.description}</p>
      )}

      {task.attachmentUrl && (
        <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium truncate transition-opacity hover:opacity-70"
          style={{ color: '#2563EB' }}
          onClick={e => e.stopPropagation()}>
          <Paperclip size={11} />
          <span className="truncate">Attachment</span>
        </a>
      )}

      <div>
        {onStatusChange ? (
          <select value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value as Task['status'])}
            className="text-[10px] px-2 py-1 rounded-full font-semibold border-0 cursor-pointer outline-none"
            style={statusBadge[task.status]}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Done</option>
          </select>
        ) : (
          <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={statusBadge[task.status]}>
            {statusLabels[task.status]}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: '1px solid #F1F5F9', color: '#94A3B8' }}>
        <div className="flex items-center gap-1.5">
          <User size={11} />
          <span>{task.assignedTo?.name ?? 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              {isOverdue && <AlertCircle size={11} />}
              <Calendar size={11} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {isAdmin && onDelete && (
            <button onClick={() => onDelete(task._id)}
              className="transition-colors hover:text-red-500" style={{ color: '#CBD5E1' }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
