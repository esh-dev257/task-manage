import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  'todo':        { label: 'To Do',       color: '#0a0a0a', bg: '#ffffff',  dot: '#0a0a0a' },
  'in-progress': { label: 'In Progress', color: '#ffffff', bg: '#1A3BFF',  dot: '#1A3BFF' },
  'completed':   { label: 'Completed',   color: '#0a0a0a', bg: '#C8FF00',  dot: '#0a0a0a' },
};

const PRIORITY_META: Record<string, { color: string; bg: string }> = {
  high:   { color: '#ffffff', bg: '#FF3737' },
  medium: { color: '#ffffff', bg: '#FF8C00' },
  low:    { color: '#ffffff', bg: '#0a0a0a' },
};

const STAT_CARDS = [
  { key: 'total',      label: 'Total Tasks',  bg: '#1A3BFF', textColor: '#ffffff', icon: <BarChart3 size={18} /> },
  { key: 'completed',  label: 'Completed',    bg: '#C8FF00', textColor: '#0a0a0a', icon: <CheckCircle2 size={18} /> },
  { key: 'inProgress', label: 'In Progress',  bg: '#0a0a0a', textColor: '#ffffff', icon: <Clock size={18} /> },
  { key: 'todo',       label: 'To Do',        bg: '#ffffff', textColor: '#0a0a0a', icon: <ListTodo size={18} /> },
  { key: 'overdue',    label: 'Overdue',      bg: '#FF3737', textColor: '#ffffff', icon: <AlertTriangle size={18} /> },
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

  const filteredTasks  = data?.recentTasks.filter(t => filter === 'all' || t.status === filter) ?? [];
  const completionPct  = data ? Math.round((data.stats.completed / Math.max(data.stats.total, 1)) * 100) : 0;
  const hour           = new Date().getHours();
  const greeting       = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 lg:space-y-6">

      {/* Hero Banner — flat blue */}
      <div className="relative rounded-3xl overflow-hidden" style={{ background: '#1A3BFF', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}>
        <div className="absolute top-4 right-8 w-28 h-28 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.15)' }} />
        <div className="absolute top-8 right-12 w-16 h-16 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
        <div className="absolute -bottom-6 left-1/3 w-24 h-24 rounded-full" style={{ background: '#C8FF00', opacity: 0.15 }} />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: '#C8FF00' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
              {greeting}, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-white/65 text-sm mb-5">
              {loading ? 'Loading your workspace…' : `You've completed ${completionPct}% of your tasks — keep it up!`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/projects"
                className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 transition-all hover:scale-[1.03]"
                style={{ background: '#C8FF00', color: '#0a0a0a', borderRadius: '50px', border: '2px solid rgba(0,0,0,0.2)' }}>
                View Projects <ArrowRight size={14} />
              </Link>
              {!loading && data && data.stats.overdue > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5"
                  style={{ background: '#FF3737', color: '#ffffff', borderRadius: '50px', border: '2px solid rgba(0,0,0,0.2)' }}>
                  <AlertTriangle size={13} /> {data.stats.overdue} overdue
                </span>
              )}
            </div>
          </div>

          {/* Completion ring */}
          {!loading && data && (
            <div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <circle cx="48" cy="48" r="38" fill="none" stroke="#C8FF00" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - completionPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-white">{completionPct}%</span>
                </div>
              </div>
              <p className="text-[11px] font-bold" style={{ color: '#C8FF00' }}>Complete</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : STAT_CARDS.map(c => (
            <div key={c.key} className="rounded-2xl p-4 lg:p-5 cursor-default transition-all hover:-translate-y-0.5"
              style={{ background: c.bg, border: '2px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,0,0,0.12)', color: c.textColor }}>
                {c.icon}
              </div>
              <p className="text-2xl lg:text-3xl font-black" style={{ color: c.textColor }}>{data?.stats[c.key] ?? 0}</p>
              <p className="text-xs mt-0.5 truncate font-bold" style={{ color: c.textColor, opacity: 0.7 }}>{c.label}</p>
            </div>
          ))
        }
      </div>

      {/* Overdue */}
      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFF0F0', border: '2px solid #FF3737', boxShadow: '3px 3px 0 #FF3737' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#FF3737' }}>
            <AlertTriangle size={15} className="text-white" />
            <span className="text-sm font-black text-white">{data!.overdueTasks.length} Overdue Task{data!.overdueTasks.length > 1 ? 's' : ''}</span>
            <span className="text-xs text-white/70 ml-1">— action required</span>
          </div>
          <div>
            {data!.overdueTasks.map((t, i) => (
              <div key={t._id} className="px-5 py-3.5 flex items-center gap-4"
                style={{ borderBottom: i < data!.overdueTasks.length - 1 ? '1px solid #FFD0D0' : 'none' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#FF3737' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: '#0a0a0a' }}>{t.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#FF3737' }}>{t.project.name} · due {new Date(t.dueDate!).toLocaleDateString()}</p>
                </div>
                <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs font-black px-3 py-1.5 outline-none cursor-pointer"
                  style={{ background: '#ffffff', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '50px' }}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Tasks */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}>
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderBottom: '2px solid #0a0a0a', background: '#ffffff' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#1A3BFF' }} />
            <h3 className="font-black text-sm" style={{ color: '#0a0a0a' }}>My Recent Tasks</h3>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="text-xs px-3 py-1.5 font-black uppercase tracking-wide transition-all"
                style={filter === f.key
                  ? { background: '#C8FF00', color: '#0a0a0a', borderRadius: '50px', border: '2px solid #0a0a0a' }
                  : { background: '#f0f0f0', color: '#666666', border: '2px solid #e0e0e0', borderRadius: '50px' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">{Array(4).fill(0).map((_, i) => <TaskSkeleton key={i} />)}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#C8FF00', border: '2px solid #0a0a0a' }}>
              <CheckCircle2 size={20} style={{ color: '#0a0a0a' }} />
            </div>
            <p className="text-sm font-bold" style={{ color: '#888888' }}>No tasks found</p>
          </div>
        ) : (
          <div>
            {filteredTasks.map((t, i) => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
              const sm = STATUS_META[t.status];
              const pm = PRIORITY_META[t.priority];
              return (
                <div key={t._id}
                  className="px-5 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 transition-all cursor-default"
                  style={{ borderBottom: i < filteredTasks.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sm.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#0a0a0a' }}>{t.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#888888' }}>{t.project.name}</p>
                  </div>
                  <span className="hidden sm:inline text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide" style={pm}>
                    {t.priority}
                  </span>
                  <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                    className="text-[10px] font-black px-2.5 py-1.5 border-0 cursor-pointer outline-none shrink-0 rounded-full"
                    style={{ color: sm.color, background: sm.bg, border: sm.bg === '#ffffff' ? '1.5px solid #0a0a0a' : 'none' }}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {t.dueDate && (
                    <span className={`hidden md:block text-xs font-medium shrink-0 ${isOverdue ? 'text-red-500' : ''}`}
                      style={isOverdue ? {} : { color: '#aaaaaa' }}>
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
