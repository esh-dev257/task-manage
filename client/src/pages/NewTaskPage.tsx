import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

export default function NewTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '',
    priority: 'medium', dueDate: '', status: 'todo',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(r => {
        const proj = r.data as Project;
        const myRole = proj.members.find(m => m.user._id === user?._id)?.role;
        if (myRole !== 'admin') { toast.error('Admin access required'); navigate(`/projects/${id}`); return; }
        setProject(proj);
      })
      .catch(() => { toast.error('Project not found'); navigate('/projects'); });
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.dueDate) {
      const d = new Date(form.dueDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (d < today) e.dueDate = 'Due date cannot be in the past';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/tasks', {
        ...form,
        projectId: id,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      toast.success('Task created');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const f = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-8 max-w-2xl">
      <Link to={`/projects/${id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to project
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Task</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input
            value={form.title}
            onChange={e => f('title', e.target.value)}
            placeholder="Task title"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => f('description', e.target.value)}
            placeholder="Describe the task…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To</label>
            <select
              value={form.assignedTo}
              onChange={e => f('assignedTo', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Unassigned</option>
              {project?.members.map(m => (
                <option key={m.user._id} value={m.user._id}>{m.user.name} ({m.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={e => f('priority', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => f('status', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 bg-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => f('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.dueDate ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to={`/projects/${id}`}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
