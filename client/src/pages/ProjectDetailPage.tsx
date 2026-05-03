import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, UserPlus, Trash2, Crown, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { TaskSkeleton } from '../components/Skeleton';

const COLUMNS: { key: Task['status']; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'border-t-gray-400' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-blue-500' },
  { key: 'completed', label: 'Completed', color: 'border-t-green-500' },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'admin' | 'member'>('member');
  const [addingMember, setAddingMember] = useState(false);

  const myRole = project?.members.find(m => m.user._id === user?._id)?.role;
  const isAdmin = myRole === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`),
      ]);
      setProject(pRes.data);
      setTasks(tRes.data);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    try {
      const { data } = await api.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole });
      setProject(data);
      setMemberEmail('');
      setShowAddMember(false);
      toast.success('Member added');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setProject(prev => prev ? { ...prev, members: prev.members.filter(m => m.user._id !== userId) } : prev);
      toast.success('Member removed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="h-7 bg-gray-200 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">{Array(2).fill(0).map((_, j) => <TaskSkeleton key={j} />)}</div>
        ))}
      </div>
    </div>
  );

  if (!project) return <div className="p-8 text-gray-500">Project not found</div>;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && <p className="text-gray-500 text-sm mt-1">{project.description}</p>}
        </div>
        {isAdmin && (
          <Link
            to={`/projects/${id}/tasks/new`}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={16} /> New Task
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(s => !s)}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <UserPlus size={15} /> Add Member
            </button>
          )}
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
            <input
              value={memberEmail}
              onChange={e => setMemberEmail(e.target.value)}
              type="email"
              placeholder="member@example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
            />
            <select
              value={memberRole}
              onChange={e => setMemberRole(e.target.value as 'admin' | 'member')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={addingMember} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium">
              {addingMember ? '…' : 'Add'}
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-3">
          {project.members.map(m => (
            <div key={m.user._id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {m.user.name}
                  {m.role === 'admin' && <Crown size={12} className="text-yellow-500" />}
                </p>
                <p className="text-xs text-gray-500">{m.user.email}</p>
              </div>
              {isAdmin && m.user._id !== user?._id && m.user._id !== project.createdBy._id && (
                <button onClick={() => handleRemoveMember(m.user._id)} className="ml-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className={`bg-white rounded-xl border border-gray-200 border-t-4 ${col.color}`}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{colTasks.length}</span>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                {colTasks.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No tasks</p>
                ) : (
                  colTasks.map(t => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onStatusChange={handleStatusChange}
                      isAdmin={isAdmin}
                      onDelete={isAdmin ? handleDeleteTask : undefined}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
