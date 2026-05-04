import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

const fieldCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
const fieldStyle: React.CSSProperties = { background: '#f0f0f0', border: '2px solid #0a0a0a', color: '#0a0a0a' };
const label = 'block text-xs font-black mb-1.5 uppercase tracking-wide';

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
      toast.success('Task created!');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task');
    } finally { setLoading(false); }
  };

  const f = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const errBorder = (key: string) => errors[key] ? '2px solid #FF3737' : '2px solid #0a0a0a';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <Link to={`/projects/${id}`}
        className="flex items-center gap-2 text-sm font-black mb-6 transition-opacity hover:opacity-60"
        style={{ color: '#1A3BFF' }}>
        <ArrowLeft size={16} /> Back to project
      </Link>

      <h1 className="text-2xl font-black mb-6" style={{ color: '#0a0a0a' }}>New Task</h1>

      <div className="rounded-2xl p-6 space-y-5" style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}>

        <div>
          <label className={label} style={{ color: '#0a0a0a' }}>Title *</label>
          <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Task title"
            className={fieldCls} style={{ ...fieldStyle, border: errBorder('title') }} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className={label} style={{ color: '#0a0a0a' }}>Description</label>
          <textarea value={form.description} onChange={e => f('description', e.target.value)}
            placeholder="Describe the task…" rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all" style={fieldStyle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} style={{ color: '#0a0a0a' }}>Assign To</label>
            <select value={form.assignedTo} onChange={e => f('assignedTo', e.target.value)} className={fieldCls} style={fieldStyle}>
              <option value="">Unassigned</option>
              {project?.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name} ({m.role})</option>)}
            </select>
          </div>
          <div>
            <label className={label} style={{ color: '#0a0a0a' }}>Priority</label>
            <select value={form.priority} onChange={e => f('priority', e.target.value)} className={fieldCls} style={fieldStyle}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} style={{ color: '#0a0a0a' }}>Status</label>
            <select value={form.status} onChange={e => f('status', e.target.value)} className={fieldCls} style={fieldStyle}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={label} style={{ color: '#0a0a0a' }}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => f('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={fieldCls} style={{ ...fieldStyle, border: errBorder('dueDate'), colorScheme: 'light' }} />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        <div>
          <label className={label} style={{ color: '#0a0a0a' }}>Attachment URL</label>
          <input value={form.attachmentUrl} onChange={e => f('attachmentUrl', e.target.value)}
            placeholder="https://drive.google.com/…" type="url"
            className={fieldCls} style={fieldStyle} />
        </div>

        <div className="flex gap-3 pt-2">
          <Link to={`/projects/${id}`}
            className="flex-1 py-2.5 text-center rounded-xl text-sm font-black transition-colors"
            style={{ border: '2px solid #0a0a0a', color: '#0a0a0a', background: '#f0f0f0' }}>
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-black disabled:opacity-60"
            style={{ background: '#C8FF00', color: '#0a0a0a', border: '2px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}>
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
