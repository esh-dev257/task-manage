import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  'todo':        { label: 'To Do',       color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0', dot: '#94A3B8' },
  'in-progress': { label: 'In Progress', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB' },
  'completed':   { label: 'Done',        color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', dot: '#16A34A' },
};

const PRIORITY_META: Record<string, { color: string; bg: string; border: string }> = {
  high:   { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  medium: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  low:    { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
};

const STAT_CARDS = [
  { key: 'total',      label: 'Total Tasks', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: <BarChart3 size={16} /> },
  { key: 'completed',  label: 'Completed',   color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: <CheckCircle2 size={16} /> },
  { key: 'inProgress', label: 'In Progress', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <Clock size={16} /> },
  { key: 'todo',       label: 'To Do',       color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0', icon: <ListTodo size={16} /> },
  { key: 'overdue',    label: 'Overdue',     color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <AlertTriangle size={16} /> },
] as const;

const FILTERS = [
  { key: 'all',         label: 'All'    },
  { key: 'todo',        label: 'To Do'  },
  { key: 'in-progress', label: 'Active' },
  { key: 'completed',   label: 'Done'   },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDashboard = (silent = false) => {
    if (!silent) setLoading(true);
    api.get('/tasks/dashboard')
      .then(r => setData(r.data))
      .catch(() => { if (!silent) toast.error('Failed to load dashboard'); })
      .finally(() => { if (!silent) setLoading(false); });
  };

  useEffect(() => {
    fetchDashboard();
    pollRef.current = setInterval(() => fetchDashboard(true), 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setData(prev => {
        if (!prev) return prev;
        const up = (arr: Task[]) => arr.map(t => t._id === taskId ? { ...t, status } : t);
        return { ...prev, recentTasks: up(prev.recentTasks), overdueTasks: up(prev.overdueTasks) };
      });
      toast.success(`Moved to ${STATUS_META[status].label}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filteredTasks = data?.recentTasks.filter(t => filter === 'all' || t.status === filter) ?? [];
  const completionPct = data ? Math.round((data.stats.completed / Math.max(data.stats.total, 1)) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">

      {/* Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>
            {greeting}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#94A3B8' }}>
            {loading ? 'Loading…' : `${completionPct}% of your tasks are complete`}
          </p>
        </div>
        <Link to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all hover:opacity-80 self-start sm:self-auto"
          style={{ background: '#0F172A', color: '#ffffff' }}>
          View Projects <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading
          ? Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : STAT_CARDS.map(c => (
            <div key={c.key} className="rounded-xl p-4 transition-all hover:-translate-y-px cursor-default"
              style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>{data?.stats[c.key] ?? 0}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: '#94A3B8' }}>{c.label}</p>
            </div>
          ))
        }
      </div>

      {/* Overdue */}
      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #FECACA' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
            <AlertTriangle size={14} style={{ color: '#DC2626' }} />
            <span className="text-sm font-semibold" style={{ color: '#DC2626' }}>
              {data!.overdueTasks.length} overdue task{data!.overdueTasks.length > 1 ? 's' : ''}
            </span>
          </div>
          <div>
            {data!.overdueTasks.map((t, i) => (
              <div key={t._id} className="px-5 py-3 flex items-center gap-4"
                style={{ borderBottom: i < data!.overdueTasks.length - 1 ? '1px solid #FEF2F2' : 'none' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#DC2626' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{t.title}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#DC2626' }}>
                    {t.project.name} · due {new Date(t.dueDate!).toLocaleDateString()}
                  </p>
                </div>
                <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                  style={{ background: '#F8FAFC', color: '#374151', border: '1px solid #E2E8F0' }}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Done</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} style={{ color: '#2563EB' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#0F172A' }}>Recent Tasks</h3>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={filter === f.key
                  ? { background: '#0F172A', color: '#ffffff' }
                  : { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">{Array(4).fill(0).map((_, i) => <TaskSkeleton key={i} />)}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
              <CheckCircle2 size={18} style={{ color: '#CBD5E1' }} />
            </div>
            <p className="text-sm" style={{ color: '#94A3B8' }}>No tasks found</p>
          </div>
        ) : (
          <div>
            {filteredTasks.map((t, i) => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
              const sm = STATUS_META[t.status];
              const pm = PRIORITY_META[t.priority];
              return (
                <div key={t._id}
                  className="px-5 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-4 transition-colors cursor-default"
                  style={{ borderBottom: i < filteredTasks.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sm.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{t.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#94A3B8' }}>{t.project.name}</p>
                  </div>
                  <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                    style={{ color: pm.color, background: pm.bg, border: `1px solid ${pm.border}` }}>
                    {t.priority}
                  </span>
                  <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                    className="text-[10px] font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none shrink-0"
                    style={{ color: sm.color, background: sm.bg, border: `1px solid ${sm.border}` }}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Done</option>
                  </select>
                  {t.dueDate && (
                    <span className="hidden md:block text-xs shrink-0"
                      style={{ color: isOverdue ? '#DC2626' : '#CBD5E1' }}>
                      {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
