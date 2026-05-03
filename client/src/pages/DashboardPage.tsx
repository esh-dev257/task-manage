import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, BarChart3 } from 'lucide-react';
import api from '../lib/api';
import type { DashboardData, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { StatSkeleton, TaskSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-green-100 text-green-700',
};
const statusLabels: Record<string, string> = {
  'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed'
};
const priorityColors: Record<string, string> = {
  high: 'text-red-600', medium: 'text-yellow-600', low: 'text-green-600'
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
        return {
          ...prev,
          recentTasks: update(prev.recentTasks),
          overdueTasks: update(prev.overdueTasks),
        };
      });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredTasks = data?.recentTasks.filter(t => filter === 'all' || t.status === filter) ?? [];

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Tasks" value={data?.stats.total ?? 0} color="bg-indigo-100" icon={<BarChart3 className="text-indigo-600" size={22} />} />
            <StatCard label="Completed" value={data?.stats.completed ?? 0} color="bg-green-100" icon={<CheckCircle2 className="text-green-600" size={22} />} />
            <StatCard label="In Progress" value={data?.stats.inProgress ?? 0} color="bg-blue-100" icon={<Clock className="text-blue-600" size={22} />} />
            <StatCard label="To Do" value={data?.stats.todo ?? 0} color="bg-gray-100" icon={<ListTodo className="text-gray-600" size={22} />} />
            <StatCard label="Overdue" value={data?.stats.overdue ?? 0} color="bg-red-100" icon={<AlertTriangle className="text-red-600" size={22} />} />
          </>
        )}
      </div>

      {!loading && (data?.overdueTasks.length ?? 0) > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="font-semibold text-red-700 flex items-center gap-2 mb-3">
            <AlertTriangle size={16} /> Overdue Tasks ({data!.overdueTasks.length})
          </h2>
          <div className="space-y-2">
            {data!.overdueTasks.map(t => (
              <div key={t._id} className="bg-white rounded-lg px-4 py-3 flex items-center justify-between border border-red-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.project.name} • due {new Date(t.dueDate!).toLocaleDateString()}</p>
                </div>
                <select
                  value={t.status}
                  onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Tasks</h2>
          <div className="flex gap-2">
            {['all', 'todo', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="px-5 py-3"><TaskSkeleton /></div>
            ))
          ) : filteredTasks.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">No tasks found</div>
          ) : (
            filteredTasks.map(t => (
              <div key={t._id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.project.name}</p>
                </div>
                <span className={`text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                <select
                  value={t.status}
                  onChange={e => handleStatusChange(t._id, e.target.value as Task['status'])}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColors[t.status]}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {t.dueDate && (
                  <span className={`text-xs ${new Date(t.dueDate) < new Date() && t.status !== 'completed' ? 'text-red-500' : 'text-gray-400'}`}>
                    {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
