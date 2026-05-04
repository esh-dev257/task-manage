import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'member') => {
    setForm({ email: `${role}@demo.com`, password: 'demo1234' });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#08011a' }}>

      {/* ── Background blobs ── */}
      <div className="fixed top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.28) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="fixed top-[40%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-14" style={{ background: 'linear-gradient(150deg, #1a0745 0%, #3b1589 45%, #6d28d9 100%)' }}>
        {/* Panel blobs */}
        <div className="absolute -top-28 -left-28 w-72 h-72 rounded-full" style={{ background: 'rgba(192,132,252,0.25)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full" style={{ background: 'rgba(217,70,239,0.2)', filter: 'blur(70px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', filter: 'blur(50px)' }} />

        {/* Outline rings */}
        <div className="absolute top-12 right-12 w-28 h-28 rounded-full border border-white/10" />
        <div className="absolute top-20 right-20 w-14 h-14 rounded-full border border-white/10" />
        <div className="absolute bottom-28 left-10 w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute bottom-16 left-16 w-8 h-8 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Heading */}
        <div className="relative z-10">
          <p className="text-purple-300 text-sm font-medium mb-3 uppercase tracking-[0.15em]">Team Task Manager</p>
          <h1 className="text-6xl font-black text-white mb-5 leading-[1.1]">
            Welcome<br />Back!
          </h1>
          <p className="text-purple-200 text-base leading-relaxed mb-10">
            Manage projects, track tasks, and<br />collaborate with your team — all in one place.
          </p>
          <div className="space-y-3">
            {['Drag-and-drop Kanban boards', 'Role-based access control', 'Real-time auto-refresh dashboard'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-purple-100 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(16px)' }}>
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
          </div>
          <p className="text-white/85 text-sm italic">"The best task manager our team has ever used."</p>
          <p className="text-purple-300 text-xs mt-2 font-semibold">— Product Team, Startup Inc.</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#d946ef)', boxShadow: '0 4px 20px rgba(124,58,237,0.5)' }}>
              <CheckSquare size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white">TaskFlow</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white">Sign In</h2>
            <p className="text-purple-400 text-sm mt-1.5">Let's get you in</p>
          </div>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            <button type="button" onClick={() => fillDemo('admin')}
              className="flex-1 py-2 rounded-full text-xs font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(139,92,246,0.4)' }}>
              Demo Admin
            </button>
            <button type="button" onClick={() => fillDemo('member')}
              className="flex-1 py-2 rounded-full text-xs font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'rgba(217,70,239,0.2)', border: '1px solid rgba(217,70,239,0.35)' }}>
              Demo Member
            </button>
          </div>

          {/* Or divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
            <span className="text-xs text-purple-600 font-medium">or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@demo.com"
                  className="w-full pl-10 pr-4 py-3.5 text-sm text-white placeholder-purple-700 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${errors.email ? '#f87171' : 'rgba(139,92,246,0.25)'}`,
                    borderRadius: '50px',
                  }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5 pl-3">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Password</label>
                <span className="text-xs text-purple-500 hover:text-purple-300 cursor-pointer transition-colors">Forgot?</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 text-sm text-white placeholder-purple-700 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${errors.password ? '#f87171' : 'rgba(139,92,246,0.25)'}`,
                    borderRadius: '50px',
                  }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5 pl-3">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="accent-violet-500 w-4 h-4 rounded" />
              <span className="text-xs text-purple-400">Remember me</span>
            </label>

            {/* CTA button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
                borderRadius: '50px',
                boxShadow: '0 6px 30px rgba(124,58,237,0.5)',
              }}
            >
              {loading ? 'Signing in…' : <><span>Sign In</span><div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight size={13} /></div></>}
            </button>
          </form>

          <p className="text-center text-sm text-purple-500 mt-7">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-300 hover:text-white font-bold transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
