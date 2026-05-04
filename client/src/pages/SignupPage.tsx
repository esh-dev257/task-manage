import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.token, data.user);
      toast.success(`Welcome to TaskFlow, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#080114' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-12" style={{ background: 'linear-gradient(145deg, #1e0a4a 0%, #3b1373 40%, #6d28d9 100%)' }}>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full" style={{ background: 'rgba(168,85,247,0.25)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full" style={{ background: 'rgba(124,58,237,0.35)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full" style={{ background: 'rgba(196,132,252,0.2)', filter: 'blur(70px)' }} />
        <div className="absolute top-20 right-20 w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute bottom-40 left-6 w-14 h-14 rounded-full border border-white/10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Create<br />Account
          </h1>
          <p className="text-purple-200 text-base mb-8 leading-relaxed">
            Join thousands of teams already<br />using TaskFlow to ship faster.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '10k+', label: 'Teams' },
              { num: '50k+', label: 'Tasks done' },
              { num: '99%', label: 'Uptime' },
              { num: 'Free', label: 'To start' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-white font-bold text-lg">{s.num}</p>
                <p className="text-purple-300 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
          <p className="text-white/80 text-sm italic">"Set up our entire team in under 5 minutes."</p>
          <p className="text-purple-300 text-xs mt-1.5 font-medium">— Engineering Lead, TechCo</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', filter: 'blur(60px)' }} />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <CheckSquare size={17} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white">Create account</h2>
            <p className="text-purple-400 text-sm mt-1">Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-white font-semibold transition-colors">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-purple-600 outline-none transition-all"
                  style={{ background: 'rgba(88,28,135,0.18)', border: `1px solid ${errors.name ? '#f87171' : 'rgba(139,92,246,0.3)'}` }}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-purple-600 outline-none transition-all"
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
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-purple-600 outline-none transition-all"
                  style={{ background: 'rgba(88,28,135,0.18)', border: `1px solid ${errors.password ? '#f87171' : 'rgba(139,92,246,0.3)'}` }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.45)' }}
            >
              {loading ? 'Creating…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-xs text-purple-600 mt-6">
            By signing up you agree to our{' '}
            <span className="text-purple-400 cursor-pointer hover:text-purple-200 transition-colors">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
