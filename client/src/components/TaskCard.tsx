import { Calendar, User, AlertCircle, Trash2, Paperclip } from 'lucide-react';
import type { Task } from '../types';

const priorityStyles: Record<string, React.CSSProperties> = {
  high:   { background: '#FF3737', color: '#ffffff' },
  medium: { background: '#FF8C00', color: '#ffffff' },
  low:    { background: '#0a0a0a', color: '#ffffff' },
};

const statusStyles: Record<string, React.CSSProperties> = {
  'todo':        { background: '#ffffff', color: '#0a0a0a', border: '1.5px solid #0a0a0a' },
  'in-progress': { background: '#1A3BFF', color: '#ffffff' },
  'completed':   { background: '#C8FF00', color: '#0a0a0a' },
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
    <div className="rounded-xl p-4 space-y-3 transition-all hover:-translate-y-0.5"
      style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '4px 4px 0 #0a0a0a')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '3px 3px 0 #0a0a0a')}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm leading-snug" style={{ color: '#0a0a0a' }}>{task.title}</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 uppercase tracking-wide"
          style={priorityStyles[task.priority]}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs line-clamp-2" style={{ color: '#666666' }}>{task.description}</p>
      )}

      {task.attachmentUrl && (
        <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold truncate transition-opacity hover:opacity-70"
          style={{ color: '#1A3BFF' }}
          onClick={e => e.stopPropagation()}>
          <Paperclip size={11} />
          <span className="truncate">Attachment</span>
        </a>
      )}

      <div>
        {onStatusChange ? (
          <select value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value as Task['status'])}
            className="text-[10px] px-2.5 py-1 rounded-full font-black border-0 cursor-pointer outline-none uppercase tracking-wide"
            style={statusStyles[task.status]}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide"
            style={statusStyles[task.status]}>
            {statusLabels[task.status]}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1.5px solid #e0e0e0', color: '#666666' }}>
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
            <button onClick={() => onDelete(task._id)}
              className="transition-colors hover:text-red-500" style={{ color: '#aaaaaa' }}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
