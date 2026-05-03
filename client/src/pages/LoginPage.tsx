import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex bg-[#f5f6fa]">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center p-16 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckSquare size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold">TaskFlow</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Manage your team's work, effortlessly.</h2>
          <p className="text-indigo-200 text-lg">Projects, tasks, and team collaboration — all in one place.</p>

          <div className="mt-12 space-y-4">
            {['Role-based access control', 'Kanban task boards', 'Real-time dashboard'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckSquare size={11} className="text-white" />
                </div>
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full translate-y-1/3 -translate-x-1/3" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Demo credentials */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-700 space-y-0.5">
              <p className="font-semibold mb-1">Demo credentials</p>
              <p>Admin: <span className="font-mono">admin@demo.com</span> / <span className="font-mono">demo1234</span></p>
              <p>Member: <span className="font-mono">member@demo.com</span> / <span className="font-mono">demo1234</span></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 text-sm"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
