import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  'todo':        { label: 'To Do',       color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  dot: '#7c3aed' },
  'in-progress': { label: 'In Progress', color: '#2563eb', bg: 'rgba(37,99,235,0.1)',   dot: '#2563eb' },
  'completed':   { label: 'Completed',   color: '#059669', bg: 'rgba(5,150,105,0.1)',   dot: '#059669' },
};

const PRIORITY_META: Record<string, { color: string; bg: string }> = {
  high:   { color: '#dc2626', bg: 'rgba(220,38,38,0.1)'  },
  medium: { color: '#d97706', bg: 'rgba(217,119,6,0.1)'  },
  low:    { color: '#16a34a', bg: 'rgba(22,163,74,0.1)'  },
};

const STAT_CARDS = [
  { key: 'total',      label: 'Total Tasks',  gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed)', icon: <BarChart3 size={18} />,    glow: 'rgba(124,58,237,0.3)' },
  { key: 'completed',  label: 'Completed',    gradient: 'linear-gradient(135deg,#065f46,#059669)', icon: <CheckCircle2 size={18} />, glow: 'rgba(5,150,105,0.3)'  },
  { key: 'inProgress', label: 'In Progress',  gradient: 'linear-gradient(135deg,#78350f,#d97706)', icon: <Clock size={18} />,        glow: 'rgba(217,119,6,0.3)'  },
  { key: 'todo',       label: 'To Do',        gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', icon: <ListTodo size={18} />,     glow: 'rgba(59,130,246,0.3)' },
  { key: 'overdue',    label: 'Overdue',      gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)', icon: <AlertTriangle size={18} />,glow: 'rgba(220,38,38,0.3)'  },
] as const;

const FILTERS = [
  { key: 'all',         label: 'All'   },
  { key: 'todo',        label: 'To Do' },
  { key: 'in-progress', label: 'Active'},
  { key: 'completed',   label: 'Done'  },
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

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a0745 0%,#3b1589 50%,#6d28d9 100%)', boxShadow: '0 10px 40px rgba(109,40,217,0.25)' }}>
        <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full" style={{ background: 'rgba(217,70,239,0.2)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full" style={{ background: 'rgba(99,102,241,0.25)', filter: 'blur(35px)' }} />
        <div className="absolute top-4 right-36 w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute top-8 right-40 w-10 h-10 rounded-full border border-white/10" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-[0.15em] mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
              {greeting}, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-purple-200 text-sm mb-5">
              {loading ? 'Loading your workspace…' : `You've completed ${completionPct}% of your tasks — keep it up!`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/projects"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 transition-all hover:scale-[1.03]"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
                View Projects <ArrowRight size={14} />
              </Link>
              {!loading && data && data.stats.overdue > 0 && (
                <span className="inline-flex items-center gap-1.5 text-red-300 text-sm font-semibold px-4 py-2.5"
                  style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50px' }}>
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
                  <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="48" cy="48" r="38" fill="none" stroke="url(#ringGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - completionPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-white">{completionPct}%</span>
                </div>
              </div>
              <p className="text-purple-300 text-xs font-medium">Complete</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
          : STAT_CARDS.map(c => (
            <div key={c.key} className="rounded-2xl p-4 lg:p-5 relative overflow-hidden transition-all hover:-translate-y-0.5 cursor-default"
              style={{ background: c.gradient, boxShadow: `0 6px 24px ${c.glow}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {c.icon}
              </div>
              <p className="text-2xl lg:text-3xl font-black text-white">{data?.stats[c.key] ?? 0}</p>
              <p className="text-xs text-white/75 mt-0.5 truncate font-medium">{c.label}</p>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))
        }
      </div>

      {/* ── Overdue ── */}
      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff5f5', border: '1.5px solid #fecaca' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#fee2e2', borderBottom: '1px solid #fecaca' }}>
            <AlertTriangle size={15} className="text-red-500" />
            <span className="text-sm font-bold text-red-600">{data!.overdueTasks.length} Overdue Task{data!.overdueTasks.length > 1 ? 's' : ''}</span>
            <span className="text-xs text-red-400 ml-1">— action required</span>
          </div>
          <div>
            {data!.overdueTasks.map((t, i) => (
              <div key={t._id} className="px-5 py-3.5 flex items-center gap-4"
                style={{ borderBottom: i < data!.overdueTasks.length - 1 ? '1px solid #fee2e2' : 'none' }}>
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e1038' }}>{t.title}</p>
                  <p className="text-xs text-red-500 mt-0.5">{t.project.name} · due {new Date(t.dueDate!).toLocaleDateString()}</p>
                </div>
                <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs font-semibold px-3 py-1.5 outline-none cursor-pointer"
                  style={{ background: '#ede9fe', color: '#7c3aed', border: '1.5px solid #ddd6fe', borderRadius: '50px' }}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── My Tasks ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1.5px solid #ede9fe', boxShadow: '0 4px 24px rgba(124,58,237,0.07)' }}>
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: '1px solid #f0ebff' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#7c3aed' }} />
            <h3 className="font-bold text-sm" style={{ color: '#1e1038' }}>My Recent Tasks</h3>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="text-xs px-3 py-1.5 font-semibold transition-all"
                style={filter === f.key
                  ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white', borderRadius: '50px', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }
                  : { background: '#f5f3ff', color: '#7c3aed', border: '1.5px solid #ddd6fe', borderRadius: '50px' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">{Array(4).fill(0).map((_, i) => <TaskSkeleton key={i} />)}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe' }}>
              <CheckCircle2 size={20} style={{ color: '#c4b5fd' }} />
            </div>
            <p className="text-sm" style={{ color: '#c4b5fd' }}>No tasks found</p>
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
                  style={{ borderBottom: i < filteredTasks.length - 1 ? '1px solid #f5f3ff' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#faf8ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sm.dot, boxShadow: `0 0 6px ${sm.dot}55` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1e1038' }}>{t.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#a78bfa' }}>{t.project.name}</p>
                  </div>
                  <span className="hidden sm:inline text-[11px] font-bold px-2.5 py-0.5" style={{ ...pm, borderRadius: '50px' }}>
                    {t.priority}
                  </span>
                  <select value={t.status} onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                    className="text-[11px] font-semibold px-2.5 py-1.5 border-0 cursor-pointer outline-none shrink-0"
                    style={{ color: sm.color, background: sm.bg, borderRadius: '50px' }}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {t.dueDate && (
                    <span className={`hidden md:block text-xs font-medium shrink-0 ${isOverdue ? 'text-red-500' : ''}`}
                      style={isOverdue ? {} : { color: '#c4b5fd' }}>
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
