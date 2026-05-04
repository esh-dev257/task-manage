import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { CardSkeleton } from '../components/Skeleton';

const PROJECT_COLORS = ['#1A3BFF', '#C8FF00', '#0a0a0a', '#1A3BFF', '#C8FF00', '#0a0a0a'];
const PROJECT_TEXT   = ['#ffffff', '#0a0a0a', '#ffffff', '#ffffff', '#0a0a0a', '#ffffff'];

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <p className="text-sm font-bold" style={{ color: '#666666' }}>{total} project{total !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 font-black text-sm transition-all hover:scale-[1.03]"
          style={{ background: '#C8FF00', color: '#0a0a0a', borderRadius: '50px', border: '2px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#C8FF00', border: '2px solid #0a0a0a' }}>
            <FolderKanban style={{ color: '#0a0a0a' }} size={28} />
          </div>
          <p className="font-black text-lg" style={{ color: '#0a0a0a' }}>No projects yet</p>
          <p className="text-sm" style={{ color: '#666666' }}>Create your first project to get started</p>
          <button onClick={() => setShowModal(true)}
            className="mt-1 flex items-center gap-2 px-4 py-2 font-black text-sm"
            style={{ background: '#C8FF00', color: '#0a0a0a', borderRadius: '50px', border: '2px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}>
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const role = p.members.find(m => m.user)?.role ?? 'member';
            const cardColor = PROJECT_COLORS[i % PROJECT_COLORS.length];
            const cardText  = PROJECT_TEXT[i % PROJECT_TEXT.length];
            return (
              <Link key={p._id} to={`/projects/${p._id}`}
                className="rounded-2xl overflow-hidden block group transition-all hover:-translate-y-1"
                style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '6px 6px 0 #0a0a0a')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '4px 4px 0 #0a0a0a')}>
                <div className="h-24 p-5 relative overflow-hidden flex items-end" style={{ background: cardColor }}>
                  <div className="absolute top-3 right-3 w-14 h-14 rounded-full" style={{ border: `1.5px solid ${cardText === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}` }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cardText === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}>
                    <FolderKanban size={18} style={{ color: cardText }} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black group-hover:opacity-70 transition-opacity" style={{ color: '#0a0a0a' }}>{p.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 uppercase tracking-wide"
                      style={role === 'admin'
                        ? { background: '#C8FF00', color: '#0a0a0a', border: '1.5px solid #0a0a0a' }
                        : { background: '#f0f0f0', color: '#666666', border: '1.5px solid #d0d0d0' }}>
                      {role}
                    </span>
                  </div>
                  {p.description
                    ? <p className="text-sm line-clamp-2 mb-4" style={{ color: '#666666' }}>{p.description}</p>
                    : <p className="text-sm italic mb-4" style={{ color: '#aaaaaa' }}>No description</p>
                  }
                  <div className="flex items-center justify-between text-xs pt-3" style={{ borderTop: '1.5px solid #e0e0e0', color: '#aaaaaa' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {p.members.slice(0, 3).map(m => (
                          <div key={m.user._id} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black"
                            style={{ background: '#1A3BFF', color: '#ffffff' }}>
                            {m.user.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span className="font-medium">{p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
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
            className="px-4 py-2 text-sm font-black transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '2px solid #0a0a0a', color: '#0a0a0a', borderRadius: '50px', boxShadow: '2px 2px 0 #0a0a0a' }}>
            ← Prev
          </button>
          <span className="text-sm font-bold" style={{ color: '#666666' }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 text-sm font-black transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '2px solid #0a0a0a', color: '#0a0a0a', borderRadius: '50px', boxShadow: '2px 2px 0 #0a0a0a' }}>
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}>
            <h2 className="text-lg font-black mb-1" style={{ color: '#0a0a0a' }}>New Project</h2>
            <p className="text-sm mb-5" style={{ color: '#666666' }}>You'll be the admin of this project</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: '#0a0a0a' }}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: '#f0f0f0', border: '2px solid #0a0a0a', color: '#0a0a0a' }} />
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: '#0a0a0a' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What is this project about?" rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#f0f0f0', border: '2px solid #0a0a0a', color: '#0a0a0a' }} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setForm({ name: '', description: '' }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black transition-colors"
                  style={{ border: '2px solid #0a0a0a', color: '#0a0a0a', background: '#f0f0f0' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 text-sm font-black disabled:opacity-60"
                  style={{ background: '#C8FF00', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '12px', boxShadow: '3px 3px 0 #0a0a0a' }}>
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
