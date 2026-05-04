import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckSquare, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const inputStyle = (error?: string): React.CSSProperties => ({
  background: "#ffffff",
  border: `2px solid ${error ? "#FF3737" : "#0a0a0a"}`,
  borderRadius: "12px",
  color: "#0a0a0a",
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "admin" | "member") => {
    setForm({ email: `${role}@demo.com`, password: "demo1234" });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#f0f0f0" }}>

      {/* Left panel — solid blue */}
      <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-14"
        style={{ background: "#1A3BFF", borderRight: "2px solid #0a0a0a" }}>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full" style={{ border: "2px solid rgba(255,255,255,0.2)" }} />
        <div className="absolute top-16 right-16 w-20 h-20 rounded-full" style={{ border: "2px solid rgba(255,255,255,0.15)" }} />
        <div className="absolute bottom-20 left-8 w-24 h-24 rounded-full" style={{ border: "2px solid rgba(255,255,255,0.15)" }} />
        <div className="absolute bottom-36 left-14 w-12 h-12 rounded-full" style={{ background: "#C8FF00", opacity: 0.3 }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#C8FF00" }}>
            <CheckSquare size={22} style={{ color: "#0a0a0a" }} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">TaskFlow</span>
        </div>

        <div className="relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#C8FF00" }}>
            Team Task Manager
          </p>
          <h1 className="text-6xl font-black text-white mb-5 leading-[1.05]">
            Welcome<br />Back!
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-10">
            Manage projects, track tasks, and<br />collaborate with your team.
          </p>
          <div className="space-y-3">
            {["Drag-and-drop Kanban boards", "Role-based access control", "Real-time dashboard stats"].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#C8FF00" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "#0a0a0a" }} />
                </div>
                <span className="text-white/85 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)" }}>
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
          </div>
          <p className="text-white/85 text-sm italic">"The best task manager our team has ever used."</p>
          <p className="text-[11px] mt-2 font-bold" style={{ color: "#C8FF00" }}>-Product Team, Startup Inc.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#1A3BFF", border: "2px solid #0a0a0a" }}>
              <CheckSquare size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black" style={{ color: "#0a0a0a" }}>TaskFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black" style={{ color: "#0a0a0a" }}>Sign In</h2>
            <p className="text-sm mt-1.5" style={{ color: "#666666" }}>Let's get you in</p>
          </div>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            {(["admin", "member"] as const).map(role => (
              <button key={role} type="button" onClick={() => fillDemo(role)}
                className="flex-1 py-2 text-xs font-black uppercase tracking-wide transition-all hover:scale-[1.02]"
                style={{ background: "#C8FF00", color: "#0a0a0a", borderRadius: "8px", border: "2px solid #0a0a0a" }}>
                Demo {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "#0a0a0a", opacity: 0.15 }} />
            <span className="text-xs font-bold" style={{ color: "#888888" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "#0a0a0a", opacity: 0.15 }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black mb-2 uppercase tracking-wide" style={{ color: "#0a0a0a" }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#888888" }} />
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@demo.com"
                  className="w-full pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
                  style={inputStyle(errors.email)} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 pl-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wide" style={{ color: "#0a0a0a" }}>Password</label>
                <span className="text-xs font-semibold cursor-pointer" style={{ color: "#888888" }}>Forgot?</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#888888" }} />
                <input type={showPw ? "text" : "password"} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 text-sm outline-none transition-all"
                  style={inputStyle(errors.password)} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                  style={{ color: "#888888" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 pl-1">{errors.password}</p>}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4" style={{ accentColor: "#1A3BFF" }} />
              <span className="text-xs font-medium" style={{ color: "#666666" }}>Remember me</span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#C8FF00", borderRadius: "12px", border: "2px solid #0a0a0a", color: "#0a0a0a", boxShadow: "3px 3px 0 #0a0a0a" }}>
              {loading ? "Signing in…" : (
                <>
                  <span>Sign In</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#0a0a0a" }}>
                    <ArrowRight size={13} className="text-white" />
                  </div>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-7" style={{ color: "#666666" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-black transition-colors hover:opacity-70" style={{ color: "#1A3BFF" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
