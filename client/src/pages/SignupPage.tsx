import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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

  const fields = [
    { key: 'name' as const,     label: 'Full Name', type: 'text',     placeholder: 'Jane Doe' },
    { key: 'email' as const,    label: 'Email',     type: 'email',    placeholder: 'you@example.com' },
    { key: 'password' as const, label: 'Password',  type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative" style={{ background: 'linear-gradient(135deg, #0f0520 0%, #2d1065 50%, #4a1a7a 100%)' }}>
      {/* Decorative circles */}
      <div className="fixed -top-20 -right-15 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      <div className="fixed -bottom-15 left-[10%] w-56 h-56 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)' }}>
            <CheckSquare size={18} className="text-purple-300" />
          </div>
          <span className="text-xl font-bold text-white">TaskFlow</span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(30, 10, 60, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-purple-400 text-sm mb-6">Join your team on TaskFlow</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-purple-300 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-purple-500 outline-none transition-all"
                  style={{ background: 'rgba(88, 28, 135, 0.3)', border: `1px solid ${errors[key] ? '#f87171' : 'rgba(139,92,246,0.35)'}` }}
                />
                {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide uppercase transition-all disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-purple-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-300 hover:text-white font-semibold transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
