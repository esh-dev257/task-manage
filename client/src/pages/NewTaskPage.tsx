import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

const inputStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  color: '#0F172A',
};

const label = 'block text-xs font-medium mb-1.5';

export default function NewTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo', attachmentUrl: '' });
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
      await api.post('/tasks', { ...form, projectId: id, assignedTo: form.assignedTo || undefined, dueDate: form.dueDate || undefined, attachmentUrl: form.attachmentUrl || undefined });
      toast.success('Task created');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task');
    } finally { setLoading(false); }
  };

  const f = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const fieldStyle = (key: string): React.CSSProperties => ({
    ...inputStyle,
    border: errors[key] ? '1px solid #F87171' : '1px solid #D1D5DB',
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <Link to={`/projects/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-opacity hover:opacity-60"
        style={{ color: '#64748B' }}>
        <ArrowLeft size={14} /> Back to project
      </Link>

      <h1 className="text-xl font-bold mb-5" style={{ color: '#0F172A' }}>New Task</h1>

      <div className="rounded-xl p-6 space-y-5" style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

        <div>
          <label className={label} style={{ color: '#374151' }}>Title *</label>
          <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Task title"
            className="w-full px-3 py-2.5 text-sm" style={fieldStyle('title')} />
          {errors.title && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.title}</p>}
        </div>

        <div>
          <label className={label} style={{ color: '#374151' }}>Description</label>
          <textarea value={form.description} onChange={e => f('description', e.target.value)}
            placeholder="Describe the task…" rows={3}
            className="w-full px-3 py-2.5 text-sm resize-none" style={inputStyle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} style={{ color: '#374151' }}>Assign To</label>
            <select value={form.assignedTo} onChange={e => f('assignedTo', e.target.value)}
              className="w-full px-3 py-2.5 text-sm" style={inputStyle}>
              <option value="">Unassigned</option>
              {project?.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name} ({m.role})</option>)}
            </select>
          </div>
          <div>
            <label className={label} style={{ color: '#374151' }}>Priority</label>
            <select value={form.priority} onChange={e => f('priority', e.target.value)}
              className="w-full px-3 py-2.5 text-sm" style={inputStyle}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} style={{ color: '#374151' }}>Status</label>
            <select value={form.status} onChange={e => f('status', e.target.value)}
              className="w-full px-3 py-2.5 text-sm" style={inputStyle}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={label} style={{ color: '#374151' }}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => f('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 text-sm" style={{ ...fieldStyle('dueDate'), colorScheme: 'light' }} />
            {errors.dueDate && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.dueDate}</p>}
          </div>
        </div>

        <div>
          <label className={label} style={{ color: '#374151' }}>Attachment URL</label>
          <input value={form.attachmentUrl} onChange={e => f('attachmentUrl', e.target.value)}
            placeholder="https://drive.google.com/…" type="url"
            className="w-full px-3 py-2.5 text-sm" style={inputStyle} />
        </div>

        <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid #F1F5F9' }}>
          <Link to={`/projects/${id}`}
            className="flex-1 py-2.5 text-center rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ border: '1px solid #E2E8F0', color: '#374151' }}>
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#0F172A' }}>
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
