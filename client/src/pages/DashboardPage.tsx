import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-emerald-100 text-emerald-700',
};
const statusLabels: Record<string, string> = {
  'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed',
};
const priorityBadge: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-green-100 text-green-600',
};

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
        const update = (arr: Task[]) => arr.map(t => t._id === taskId ? { ...t, status } : t);
        return { ...prev, recentTasks: update(prev.recentTasks), overdueTasks: update(prev.overdueTasks) };
      });
      toast.success(`Status updated to ${statusLabels[status]}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredTasks = data?.recentTasks.filter(t => filter === 'all' || t.status === filter) ?? [];

  return (
    <div className="p-8 space-y-6">

      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 p-7 text-white">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold mb-1">Hi, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-indigo-200 text-sm">Ready to tackle your tasks today?</p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            View Projects <ArrowRight size={14} />
          </Link>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-16 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-32 w-16 h-16 bg-purple-400/30 rounded-full" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Tasks"  value={data?.stats.total ?? 0}      bg="bg-indigo-500"  textColor="text-white" icon={<BarChart3 size={20} />} />
            <StatCard label="Completed"    value={data?.stats.completed ?? 0}  bg="bg-emerald-500" textColor="text-white" icon={<CheckCircle2 size={20} />} sub="Done" />
            <StatCard label="In Progress"  value={data?.stats.inProgress ?? 0} bg="bg-amber-400"   textColor="text-white" icon={<Clock size={20} />} />
            <StatCard label="To Do"        value={data?.stats.todo ?? 0}       bg="bg-violet-500"  textColor="text-white" icon={<ListTodo size={20} />} />
            <StatCard label="Overdue"      value={data?.stats.overdue ?? 0}    bg="bg-rose-500"    textColor="text-white" icon={<AlertTriangle size={20} />} sub="Alert" />
          </>
        )}
      </div>

      {/* Overdue Alert */}
      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <h3 className="font-semibold text-rose-700 flex items-center gap-2 mb-3 text-sm">
            <AlertTriangle size={15} /> {data!.overdueTasks.length} Overdue Task{data!.overdueTasks.length > 1 ? 's' : ''}
          </h3>
          <div className="space-y-2">
            {data!.overdueTasks.map(t => (
              <div key={t._id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-rose-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.project.name} · due {new Date(t.dueDate!).toLocaleDateString()}</p>
                </div>
                <select
                  value={t.status}
                  onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 outline-none"
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">My Tasks</h3>
          <div className="flex gap-1.5">
            {['all', 'todo', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All' : statusLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {Array(4).fill(0).map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-gray-400 text-sm">No tasks found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTasks.map(t => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
              return (
                <div key={t._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{t.project.name}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${priorityBadge[t.priority]}`}>
                    {t.priority}
                  </span>
                  <select
                    value={t.status}
                    onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none ${statusColors[t.status]}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {t.dueDate && (
                    <span className={`text-xs font-medium ${isOverdue ? 'text-rose-500' : 'text-gray-400'}`}>
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
