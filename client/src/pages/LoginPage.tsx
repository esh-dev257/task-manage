import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex" style={{ background: '#080114' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(145deg, #2d1065 0%, #4c1d95 40%, #7c3aed 100%)' }}>
        {/* Organic blob shapes */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full" style={{ background: 'rgba(168,85,247,0.3)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full" style={{ background: 'rgba(124,58,237,0.4)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full" style={{ background: 'rgba(196,132,252,0.2)', filter: 'blur(70px)' }} />
        {/* Decorative circles */}
        <div className="absolute top-16 right-16 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute top-28 right-28 w-12 h-12 rounded-full border border-white/10" />
        <div className="absolute bottom-32 left-8 w-16 h-16 rounded-full border border-white/10" />
        <div className="absolute bottom-16 left-20 w-8 h-8 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Welcome<br />Back!
          </h1>
          <p className="text-purple-200 text-base mb-8 leading-relaxed">
            Manage your team, track your tasks,<br />and ship projects faster.
          </p>
          <div className="space-y-3">
            {['Drag-and-drop Kanban boards', 'Role-based team access', 'Real-time dashboard stats'].map(feat => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-purple-100 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
          <p className="text-white/80 text-sm italic">"The best task manager our team has ever used."</p>
          <p className="text-purple-300 text-xs mt-1.5 font-medium">— Product Team, Startup Inc.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        {/* Background subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent)', filter: 'blur(50px)' }} />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <CheckSquare size={17} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="text-purple-400 text-sm mt-1">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@demo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-purple-600 outline-none transition-all focus:border-purple-400"
                  style={{ background: 'rgba(88,28,135,0.18)', border: `1px solid ${errors.email ? '#f87171' : 'rgba(139,92,246,0.3)'}` }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-purple-600 outline-none transition-all focus:border-purple-400"
                  style={{ background: 'rgba(88,28,135,0.18)', border: `1px solid ${errors.password ? '#f87171' : 'rgba(139,92,246,0.3)'}` }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-purple-400 cursor-pointer select-none">
                <input type="checkbox" className="accent-violet-500 w-3.5 h-3.5" />
                Remember me
              </label>
              <span className="text-xs text-purple-400 hover:text-purple-200 cursor-pointer transition-colors">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.45)' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            {/* Demo hint */}
            <div className="rounded-xl px-4 py-3 text-xs" style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(139,92,246,0.18)' }}>
              <p className="text-purple-300 font-semibold mb-1">Demo credentials</p>
              <p className="text-purple-400">admin@demo.com &nbsp;/&nbsp; demo1234</p>
              <p className="text-purple-400">member@demo.com / demo1234</p>
            </div>
          </form>

          <p className="text-center text-xs text-purple-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-300 hover:text-white font-semibold transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
