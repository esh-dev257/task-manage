import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, UserPlus, Trash2, Crown, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import api from '../lib/api';
import type { Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { TaskSkeleton } from '../components/Skeleton';

const COLUMNS: { key: Task['status']; label: string; accent: string; dragBg: string; dot: string }[] = [
  { key: 'todo',        label: 'To Do',       accent: '#1A3BFF', dragBg: 'rgba(26,59,255,0.05)', dot: '#1A3BFF' },
  { key: 'in-progress', label: 'In Progress', accent: '#C8FF00', dragBg: 'rgba(200,255,0,0.08)', dot: '#C8FF00' },
  { key: 'completed',   label: 'Completed',   accent: '#0a0a0a', dragBg: 'rgba(0,0,0,0.03)',     dot: '#0a0a0a' },
];

const STATUS_LABELS: Record<Task['status'], string> = {
  'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed',
};

const fieldStyle: React.CSSProperties = { background: '#f0f0f0', border: '2px solid #0a0a0a', color: '#0a0a0a' };

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject]       = useState<Project | null>(null);
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [loading, setLoading]       = useState(true);
  const [taskPage, setTaskPage]     = useState(1);
  const [taskPages, setTaskPages]   = useState(1);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail]     = useState('');
  const [memberRole, setMemberRole]       = useState<'admin' | 'member'>('member');
  const [addingMember, setAddingMember]   = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const myRole = project?.members.find(m => m.user._id === user?._id)?.role;
  const isAdmin = myRole === 'admin';

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}&page=${taskPage}&limit=50`),
      ]);
      setProject(pRes.data);
      setTasks(tRes.data.tasks);
      setTaskPages(tRes.data.pages);
    } catch {
      if (!silent) toast.error('Failed to load project');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id, taskPage]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    pollRef.current = setInterval(() => load(true), 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [load]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success(`Moved to ${STATUS_LABELS[status]}`);
    } catch { toast.error('Failed to update task'); }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const srcCol = source.droppableId as Task['status'];
    const dstCol = destination.droppableId as Task['status'];
    if (srcCol === dstCol && source.index === destination.index) return;

    setTasks(prev => {
      const next = [...prev];
      const taskIdx = next.findIndex(t => t._id === draggableId);
      if (taskIdx === -1) return prev;
      const [moved] = next.splice(taskIdx, 1);
      moved.status = dstCol;
      const dstTasks = next.filter(t => t.status === dstCol);
      const insertBefore = dstTasks[destination.index];
      const insertIdx = insertBefore ? next.findIndex(t => t._id === insertBefore._id) : next.length;
      next.splice(insertIdx, 0, moved);
      return next;
    });

    if (srcCol !== dstCol) {
      try {
        await api.put(`/tasks/${draggableId}`, { status: dstCol });
        toast.success(`Moved to ${STATUS_LABELS[dstCol]}`);
      } catch { toast.error('Failed to move task'); load(); }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
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
      toast.success('Member added successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this project?`)) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setProject(prev => prev ? { ...prev, members: prev.members.filter(m => m.user._id !== userId) } : prev);
      toast.success(`${name} removed from project`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="h-7 rounded-xl w-48 animate-pulse" style={{ background: '#d4d4d4' }} />
      <div className="grid grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">{Array(2).fill(0).map((_, j) => <TaskSkeleton key={j} />)}</div>
        ))}
      </div>
    </div>
  );

  if (!project) return <div className="p-8 text-sm font-bold" style={{ color: '#888888' }}>Project not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#0a0a0a' }}>{project.name}</h1>
          {project.description && <p className="text-sm mt-1" style={{ color: '#666666' }}>{project.description}</p>}
        </div>
        {isAdmin && (
          <Link to={`/projects/${id}/tasks/new`}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-black transition-all hover:scale-[1.03] shrink-0"
            style={{ background: '#C8FF00', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '50px', boxShadow: '3px 3px 0 #0a0a0a' }}>
            <Plus size={15} /> New Task
          </Link>
        )}
      </div>

      {/* Members */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black" style={{ color: '#0a0a0a' }}>Team Members</h2>
          {isAdmin && (
            <button onClick={() => setShowAddMember(s => !s)}
              className="flex items-center gap-1.5 text-sm font-black transition-opacity hover:opacity-60"
              style={{ color: '#1A3BFF' }}>
              <UserPlus size={15} /> Add Member
            </button>
          )}
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} type="email"
              placeholder="member@example.com"
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={fieldStyle} />
            <select value={memberRole} onChange={e => setMemberRole(e.target.value as 'admin' | 'member')}
              className="px-3 py-2.5 rounded-xl text-sm outline-none" style={fieldStyle}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={addingMember}
              className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-60"
              style={{ background: '#C8FF00', color: '#0a0a0a', border: '2px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a' }}>
              {addingMember ? '…' : 'Add'}
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-3">
          {project.members.map(m => (
            <div key={m.user._id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#f0f0f0', border: '1.5px solid #d0d0d0' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs"
                style={{ background: '#1A3BFF', color: '#ffffff' }}>
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-1" style={{ color: '#0a0a0a' }}>
                  {m.user.name}
                  {m.role === 'admin' && <Crown size={11} className="text-yellow-500" />}
                </p>
                <p className="text-xs" style={{ color: '#888888' }}>{m.user.email}</p>
              </div>
              {isAdmin && m.user._id !== user?._id && m.user._id !== project.createdBy._id && (
                <button onClick={() => handleRemoveMember(m.user._id, m.user.name)}
                  className="ml-1 transition-colors hover:text-red-500" style={{ color: '#aaaaaa' }}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Drag hint */}
      <p className="text-xs mb-3 flex items-center gap-1 font-medium" style={{ color: '#aaaaaa' }}>
        <GripVertical size={13} /> Drag tasks between columns to update status
      </p>

      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-2 -mx-1">
          <div className="grid grid-cols-3 gap-4 min-w-[700px] px-1">
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.key);
              const headerText = col.accent === '#C8FF00' ? '#0a0a0a' : '#ffffff';
              return (
                <div key={col.key} className="rounded-2xl overflow-hidden"
                  style={{ background: '#ffffff', border: '2px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}>
                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ background: col.accent, borderBottom: '2px solid #0a0a0a' }}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm" style={{ color: headerText }}>{col.label}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-black"
                      style={{ background: 'rgba(0,0,0,0.15)', color: headerText }}>
                      {colTasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={col.key}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}
                        className="p-3 min-h-50 transition-colors"
                        style={{ background: snapshot.isDraggingOver ? col.dragBg : 'transparent' }}>
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <p className="text-xs text-center py-8 font-medium" style={{ color: '#cccccc' }}>No tasks</p>
                        )}
                        {colTasks.map((t, index) => (
                          <Draggable key={t._id} draggableId={t._id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps}
                                className={`mb-3 transition-all ${snapshot.isDragging ? 'rotate-1 scale-105' : ''}`}
                                style={{ ...provided.draggableProps.style, filter: snapshot.isDragging ? 'drop-shadow(4px 4px 0 rgba(0,0,0,0.3))' : undefined }}>
                                <div className="relative group">
                                  <div {...provided.dragHandleProps}
                                    className="absolute -left-1 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                    style={{ color: '#aaaaaa' }}>
                                    <GripVertical size={14} />
                                  </div>
                                  <TaskCard task={t} onStatusChange={handleStatusChange} isAdmin={isAdmin}
                                    onDelete={isAdmin ? handleDeleteTask : undefined} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {taskPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setTaskPage(p => Math.max(1, p - 1))} disabled={taskPage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-black transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '2px solid #0a0a0a', color: '#0a0a0a', borderRadius: '50px', boxShadow: '2px 2px 0 #0a0a0a' }}>
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm font-bold" style={{ color: '#666666' }}>Page {taskPage} of {taskPages}</span>
          <button onClick={() => setTaskPage(p => Math.min(taskPages, p + 1))} disabled={taskPage === taskPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-black transition-all disabled:opacity-40"
            style={{ background: '#ffffff', border: '2px solid #0a0a0a', color: '#0a0a0a', borderRadius: '50px', boxShadow: '2px 2px 0 #0a0a0a' }}>
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
