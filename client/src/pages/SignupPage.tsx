import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#08011a' }}>

      {/* ── Background blobs ── */}
      <div className="fixed top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="fixed top-[55%] left-[45%] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-14" style={{ background: 'linear-gradient(150deg, #0e0530 0%, #2d1065 45%, #7e22ce 100%)' }}>
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full" style={{ background: 'rgba(168,85,247,0.3)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-50px] left-[-50px] w-72 h-72 rounded-full" style={{ background: 'rgba(217,70,239,0.25)', filter: 'blur(70px)' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', filter: 'blur(50px)' }} />

        <div className="absolute top-16 left-12 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute top-24 left-20 w-10 h-10 rounded-full border border-white/10" />
        <div className="absolute bottom-32 right-10 w-20 h-20 rounded-full border border-white/10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <p className="text-purple-300 text-sm font-medium mb-3 uppercase tracking-[0.15em]">Get started free</p>
          <h1 className="text-6xl font-black text-white mb-5 leading-[1.1]">
            Create<br />Account
          </h1>
          <p className="text-purple-200 text-base leading-relaxed mb-10">
            Join thousands of teams shipping faster<br />with TaskFlow's powerful toolkit.
          </p>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '10k+', label: 'Teams worldwide' },
              { num: '50k+', label: 'Tasks shipped' },
              { num: '99.9%', label: 'Uptime SLA' },
              { num: 'Free', label: 'Forever plan' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <p className="text-white font-black text-xl">{s.num}</p>
                <p className="text-purple-300 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(16px)' }}>
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
          </div>
          <p className="text-white/85 text-sm italic">"Set up our entire team in under 5 minutes."</p>
          <p className="text-purple-300 text-xs mt-2 font-semibold">— Engineering Lead, TechCo</p>
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
            <h2 className="text-3xl font-black text-white">Create Account</h2>
            <p className="text-purple-400 text-sm mt-1.5">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-white font-bold transition-colors">Sign in</Link>
            </p>
          </div>

          {/* Or divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
            <span className="text-xs text-purple-600 font-medium">create with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3.5 text-sm text-white placeholder-purple-700 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${errors.name ? '#f87171' : 'rgba(139,92,246,0.25)'}`,
                    borderRadius: '50px',
                  }}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1.5 pl-3">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
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
              <label className="block text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
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

            {/* CTA */}
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
              {loading ? 'Creating…' : <><span>Sign Up</span><div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight size={13} /></div></>}
            </button>
          </form>

          <p className="text-center text-xs text-purple-600 mt-7">
            By signing up you agree to our{' '}
            <span className="text-purple-400 cursor-pointer hover:text-purple-200 transition-colors">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
