import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

const inputStyle: React.CSSProperties = {
  background: 'rgba(88,28,135,0.3)',
  border: '1px solid rgba(139,92,246,0.35)',
  color: 'white',
};

export default function NewTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(r => {
        const proj = r.data as Project;
        if (proj.members.find(m => m.user._id === user?._id)?.role !== 'admin') {
          toast.error('Admin access required'); navigate(`/projects/${id}`); return;
        }
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
      await api.post('/tasks', { ...form, projectId: id, assignedTo: form.assignedTo || undefined, dueDate: form.dueDate || undefined });
      toast.success('Task created!');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task');
    } finally { setLoading(false); }
  };

  const f = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-8 max-w-2xl">
      <Link to={`/projects/${id}`} className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to project
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">New Task</h1>

      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(20,8,46,0.8)', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div>
          <label className="block text-sm text-purple-300 mb-1.5">Title *</label>
          <input
            value={form.title}
            onChange={e => f('title', e.target.value)}
            placeholder="Task title"
            className="w-full px-4 py-3 rounded-xl text-sm placeholder-purple-600 outline-none"
            style={{ ...inputStyle, borderColor: errors.title ? '#f87171' : 'rgba(139,92,246,0.35)' }}
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm text-purple-300 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => f('description', e.target.value)}
            placeholder="Describe the task…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm placeholder-purple-600 outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1.5">Assign To</label>
            <select value={form.assignedTo} onChange={e => f('assignedTo', e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}>
              <option value="">Unassigned</option>
              {project?.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name} ({m.role})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-purple-300 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => f('priority', e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-purple-300 mb-1.5">Status</label>
            <select value={form.status} onChange={e => f('status', e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-purple-300 mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => f('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ ...inputStyle, borderColor: errors.dueDate ? '#f87171' : 'rgba(139,92,246,0.35)', colorScheme: 'dark' }}
            />
            {errors.dueDate && <p className="text-xs text-red-400 mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link to={`/projects/${id}`} className="flex-1 py-2.5 text-center rounded-xl text-sm font-semibold text-purple-300 hover:text-white transition-colors" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
