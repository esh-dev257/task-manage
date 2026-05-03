import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const statusStyles: Record<string, React.CSSProperties> = {
  'todo':        { background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' },
  'in-progress': { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  'completed':   { background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' },
};
const statusLabels: Record<string, string> = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' };

const priorityStyles: Record<string, React.CSSProperties> = {
  high:   { background: 'rgba(239,68,68,0.15)',  color: '#fca5a5' },
  medium: { background: 'rgba(251,191,36,0.15)', color: '#fde68a' },
  low:    { background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' },
};

const STAT_CARDS = [
  { key: 'total',      label: 'Total Tasks',  gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed)', icon: <BarChart3 size={20} /> },
  { key: 'completed',  label: 'Completed',    gradient: 'linear-gradient(135deg,#065f46,#059669)', icon: <CheckCircle2 size={20} />, sub: 'Done' },
  { key: 'inProgress', label: 'In Progress',  gradient: 'linear-gradient(135deg,#92400e,#d97706)', icon: <Clock size={20} /> },
  { key: 'todo',       label: 'To Do',        gradient: 'linear-gradient(135deg,#3730a3,#6366f1)', icon: <ListTodo size={20} /> },
  { key: 'overdue',    label: 'Overdue',      gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)', icon: <AlertTriangle size={20} />, sub: 'Alert' },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/tasks/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setData(prev => {
        if (!prev) return prev;
        const up = (arr: Task[]) => arr.map(t => t._id === taskId ? { ...t, status } : t);
        return { ...prev, recentTasks: up(prev.recentTasks), overdueTasks: up(prev.overdueTasks) };
      });
      toast.success(`Moved to ${statusLabels[status]}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filteredTasks = data?.recentTasks.filter(t => filter === 'all' || t.status === filter) ?? [];

  return (
    <div className="p-8 space-y-6">

      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-7" style={{ background: 'linear-gradient(135deg, #2d1065 0%, #4a1a7a 50%, #6b21a8 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute bottom-0 right-16 w-32 h-32 rounded-full translate-y-1/2" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="absolute top-4 right-32 w-16 h-16 rounded-full" style={{ background: 'rgba(168,85,247,0.3)' }} />

        <div className="relative z-10">
          <p className="text-purple-300 text-sm font-medium mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold text-white mb-1">Hi, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-purple-300 text-sm">Ready to tackle your tasks today?</p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            View Projects <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : STAT_CARDS.map(c => (
              <StatCard
                key={c.key}
                label={c.label}
                value={data?.stats[c.key] ?? 0}
                gradient={c.gradient}
                icon={c.icon}
                sub={'sub' in c ? c.sub : undefined}
              />
            ))
        }
      </div>

      {/* Overdue */}
      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(220,38,38,0.3)' }}>
          <h3 className="font-semibold text-red-400 flex items-center gap-2 mb-3 text-sm">
            <AlertTriangle size={15} /> {data!.overdueTasks.length} Overdue Task{data!.overdueTasks.length > 1 ? 's' : ''}
          </h3>
          <div className="space-y-2">
            {data!.overdueTasks.map(t => (
              <div key={t._id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <div>
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                  <p className="text-xs text-red-400 mt-0.5">{t.project.name} · due {new Date(t.dueDate!).toLocaleDateString()}</p>
                </div>
                <select
                  value={t.status}
                  onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs rounded-lg px-2 py-1.5 outline-none text-white"
                  style={{ background: 'rgba(88,28,135,0.5)', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(20,8,46,0.8)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
          <h3 className="font-bold text-white">My Tasks</h3>
          <div className="flex gap-1.5">
            {['all', 'todo', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={filter === f
                  ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white', boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }
                  : { background: 'rgba(88,28,135,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }
                }
              >
                {f === 'all' ? 'All' : statusLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">{Array(4).fill(0).map((_, i) => <TaskSkeleton key={i} />)}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-14 text-center text-purple-500 text-sm">No tasks found</div>
        ) : (
          <div>
            {filteredTasks.map(t => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
              return (
                <div key={t._id} className="px-6 py-3.5 flex items-center gap-4 transition-colors" style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(88,28,135,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                    <p className="text-xs text-purple-400 mt-0.5 truncate">{t.project.name}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={priorityStyles[t.priority]}>
                    {t.priority}
                  </span>
                  <select
                    value={t.status}
                    onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none"
                    style={statusStyles[t.status]}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {t.dueDate && (
                    <span className={`text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-purple-500'}`}>
                      {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
