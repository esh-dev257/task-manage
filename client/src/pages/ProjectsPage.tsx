import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Calendar, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project } from '../types';
import { CardSkeleton } from '../components/Skeleton';

const PROJECT_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/projects')
      .then(r => setProjects(r.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Project name is required');
    setCreating(true);
    try {
      const { data } = await api.post('/projects', form);
      setProjects(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '' });
      toast.success(`Project "${data.name}" created!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-sm text-gray-400 mb-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-200"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <FolderKanban className="text-indigo-400" size={28} />
          </div>
          <p className="text-gray-700 font-semibold">No projects yet</p>
          <p className="text-gray-400 text-sm">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => {
            const gradient = PROJECT_COLORS[i % PROJECT_COLORS.length];
            const role = p.members.find(m => m.user)?.role ?? 'member';
            return (
              <Link
                key={p._id}
                to={`/projects/${p._id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden block group"
              >
                {/* Color header */}
                <div className={`h-24 bg-linear-to-br ${gradient} p-5 relative overflow-hidden`}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FolderKanban size={18} className="text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-600'}`}>
                      {role}
                    </span>
                  </div>
                  {p.description ? (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">{p.description}</p>
                  ) : (
                    <p className="text-sm text-gray-300 italic mb-4">No description</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {p.members.slice(0, 3).map(m => (
                          <div key={m.user._id} className="w-5 h-5 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-indigo-600">
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">New Project</h2>
            <p className="text-sm text-gray-400 mb-5">You'll be the admin of this project</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm({ name: '', description: '' }); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200"
                >
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
