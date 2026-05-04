import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { CardSkeleton } from '../components/Skeleton';

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg,#4c1d95,#7c3aed)',
  'linear-gradient(135deg,#831843,#db2777)',
  'linear-gradient(135deg,#78350f,#d97706)',
  'linear-gradient(135deg,#064e3b,#059669)',
  'linear-gradient(135deg,#1e3a5f,#2563eb)',
  'linear-gradient(135deg,#3b0764,#9333ea)',
];

const inputCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
const inputStyle: React.CSSProperties = { background: '#f9f7ff', border: '1.5px solid #ddd6fe', color: '#1e1038' };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ name: '', description: '' });
  const [creating, setCreating]   = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/projects?page=${page}&limit=9`)
      .then(r => { setProjects(r.data.projects); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name is required');
    setCreating(true);
    try {
      const { data } = await api.post('/projects', form);
      setProjects(prev => [data, ...prev]);
      setTotal(prev => prev + 1);
      setShowModal(false);
      setForm({ name: '', description: '' });
      toast.success(`Project "${data.name}" created!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setCreating(false); }
  };

  const btnPrimary: React.CSSProperties = { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)', borderRadius: '50px' };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>{total} project{total !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold transition-all hover:scale-[1.03]"
          style={btnPrimary}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe' }}>
            <FolderKanban style={{ color: '#a78bfa' }} size={28} />
          </div>
          <p className="font-bold" style={{ color: '#1e1038' }}>No projects yet</p>
          <p className="text-sm" style={{ color: '#a78bfa' }}>Create your first project to get started</p>
          <button onClick={() => setShowModal(true)}
            className="mt-1 flex items-center gap-2 px-4 py-2 text-white text-sm font-bold"
            style={btnPrimary}>
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const role = p.members.find(m => m.user)?.role ?? 'member';
            return (
              <Link key={p._id} to={`/projects/${p._id}`}
                className="rounded-2xl overflow-hidden block group transition-all hover:-translate-y-1"
                style={{ background: '#ffffff', border: '1.5px solid #ede9fe', boxShadow: '0 2px 12px rgba(124,58,237,0.07)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.07)')}>
                <div className="h-24 p-5 relative overflow-hidden" style={{ background: PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length] }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <FolderKanban size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold group-hover:text-purple-700 transition-colors" style={{ color: '#1e1038' }}>{p.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                      style={role === 'admin'
                        ? { background: 'rgba(245,158,11,0.12)', color: '#d97706' }
                        : { background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                      {role}
                    </span>
                  </div>
                  {p.description
                    ? <p className="text-sm line-clamp-2 mb-4" style={{ color: '#a78bfa' }}>{p.description}</p>
                    : <p className="text-sm italic mb-4" style={{ color: '#c4b5fd' }}>No description</p>
                  }
                  <div className="flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid #f0ebff', color: '#c4b5fd' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {p.members.slice(0, 3).map(m => (
                          <div key={m.user._id} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                            {m.user.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={11} /> {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '1.5px solid #ddd6fe', color: '#7c3aed', borderRadius: '50px' }}>
            ← Prev
          </button>
          <span className="text-sm font-medium" style={{ color: '#a78bfa' }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '1.5px solid #ddd6fe', color: '#7c3aed', borderRadius: '50px' }}>
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(30,16,70,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#ffffff', border: '1.5px solid #ede9fe', boxShadow: '0 24px 60px rgba(124,58,237,0.15)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#1e1038' }}>New Project</h2>
            <p className="text-sm mb-5" style={{ color: '#a78bfa' }}>You'll be the admin of this project</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#7c3aed' }}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mobile App Redesign" className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#7c3aed' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What is this project about?" rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all" style={inputStyle} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setForm({ name: '', description: '' }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ border: '1.5px solid #ddd6fe', color: '#7c3aed', background: '#f5f3ff' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  style={{ ...btnPrimary, borderRadius: '12px' }}>
                  {creating ? 'Creating…' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
