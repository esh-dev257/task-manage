import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { CardSkeleton } from '../components/Skeleton';

const inputStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  color: '#0F172A',
};

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
      toast.success(`"${data.name}" created`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setCreating(false); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>{total} project{total !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
          style={{ background: '#0F172A' }}>
          <Plus size={14} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            <FolderKanban size={24} style={{ color: '#CBD5E1' }} />
          </div>
          <p className="font-semibold" style={{ color: '#0F172A' }}>No projects yet</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Create your first project to get started</p>
          <button onClick={() => setShowModal(true)}
            className="mt-1 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
            style={{ background: '#0F172A' }}>
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => {
            const role = p.members.find(m => m.user)?.role ?? 'member';
            const accentColors = ['#2563EB', '#7C3AED', '#0891B2', '#059669', '#D97706', '#DC2626'];
            const accent = accentColors[i % accentColors.length];
            return (
              <Link key={p._id} to={`/projects/${p._id}`}
                className="rounded-xl overflow-hidden block group transition-all hover:-translate-y-px"
                style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)')}>
                {/* Thin accent top bar */}
                <div className="h-1" style={{ background: accent }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${accent}15` }}>
                        <FolderKanban size={15} style={{ color: accent }} />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors" style={{ color: '#0F172A' }}>{p.name}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize"
                      style={role === 'admin'
                        ? { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }
                        : { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                      {role}
                    </span>
                  </div>
                  {p.description
                    ? <p className="text-xs line-clamp-2 mb-4" style={{ color: '#64748B' }}>{p.description}</p>
                    : <p className="text-xs italic mb-4" style={{ color: '#CBD5E1' }}>No description</p>
                  }
                  <div className="flex items-center justify-between text-xs" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', color: '#94A3B8' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {p.members.slice(0, 3).map(m => (
                          <div key={m.user._id} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white"
                            style={{ background: accent }}>
                            {m.user.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span>{p.members.length} member{p.members.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} /> {new Date(p.createdAt).toLocaleDateString()}
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
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 hover:opacity-80"
            style={{ background: '#ffffff', border: '1px solid #E2E8F0', color: '#374151' }}>
            ← Prev
          </button>
          <span className="text-sm px-3" style={{ color: '#94A3B8' }}>{page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 hover:opacity-80"
            style={{ background: '#ffffff', border: '1px solid #E2E8F0', color: '#374151' }}>
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="w-full max-w-md rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: '#0F172A' }}>New Project</h2>
            <p className="text-xs mb-5" style={{ color: '#94A3B8' }}>You'll be the admin of this project</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-3 py-2.5 text-sm"
                  style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What is this project about?" rows={3}
                  className="w-full px-3 py-2.5 text-sm resize-none"
                  style={inputStyle} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => { setShowModal(false); setForm({ name: '', description: '' }); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ border: '1px solid #E2E8F0', color: '#374151' }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#0F172A' }}>
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
