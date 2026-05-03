import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0520 0%, #2d1065 50%, #4a1a7a 100%)' }}>
      {/* Decorative circles */}
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      <div className="fixed bottom-[-60px] left-[15%] w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="fixed top-[20%] right-[5%] w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #c084fc, transparent)' }} />

      {/* Left welcome panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)' }}>
            <CheckSquare size={20} className="text-purple-300" />
          </div>
          <span className="text-xl font-bold text-white">TaskFlow</span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: 'serif' }}>Welcome</h1>
        <p className="text-purple-300 text-lg">Have a great journey ahead...</p>
        <div className="mt-10 space-y-3">
          {['Manage projects & teams', 'Drag-and-drop Kanban boards', 'Role-based access control'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-purple-300 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'rgba(30, 10, 60, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <CheckSquare size={18} className="text-purple-400" />
            <span className="text-white font-bold">TaskFlow</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-purple-300 mb-1.5">Username / Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@demo.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-purple-500 outline-none transition-all"
                style={{ background: 'rgba(88, 28, 135, 0.3)', border: `1px solid ${errors.email ? '#f87171' : 'rgba(139,92,246,0.35)'}` }}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-purple-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-purple-500 outline-none transition-all"
                style={{ background: 'rgba(88, 28, 135, 0.3)', border: `1px solid ${errors.password ? '#f87171' : 'rgba(139,92,246,0.35)'}` }}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-purple-300 cursor-pointer">
                <input type="checkbox" className="accent-violet-500 rounded" />
                Remember me
              </label>
            </div>

            {/* Demo hint */}
            <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: 'rgba(88,28,135,0.25)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-purple-300 font-semibold mb-1">Demo</p>
              <p className="text-purple-400">admin@demo.com / demo1234</p>
              <p className="text-purple-400">member@demo.com / demo1234</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide uppercase transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-purple-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-300 hover:text-white font-semibold transition-colors">Sign Up</Link>
          </p>
          <p className="text-center text-xs text-purple-500 mt-2 cursor-pointer hover:text-purple-400 transition-colors">
            Forgot Password
          </p>
        </div>
      </div>
    </div>
  );
}
