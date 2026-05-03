import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare, Mail, Lock, User } from 'lucide-react';
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
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name' as const,     label: 'Full Name', type: 'text',     placeholder: 'Jane Doe',           Icon: User },
    { key: 'email' as const,    label: 'Email',     type: 'email',    placeholder: 'you@example.com',    Icon: Mail },
    { key: 'password' as const, label: 'Password',  type: 'password', placeholder: '••••••••',           Icon: Lock },
  ];

  return (
    <div className="min-h-screen flex bg-[#f5f6fa]">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 items-center justify-center p-16 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckSquare size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold">TaskFlow</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Start collaborating in minutes.</h2>
          <p className="text-purple-200 text-lg">Create your workspace and invite your team today.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full translate-y-1/3 -translate-x-1/3" />
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

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">Get started with your free workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, Icon }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors[key] ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 text-sm mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
