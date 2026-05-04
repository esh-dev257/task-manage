import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckSquare, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const inputStyle = (error?: string): React.CSSProperties => ({
  background: "#f9f7ff",
  border: `1.5px solid ${error ? "#ef4444" : "#ddd6fe"}`,
  borderRadius: "50px",
  color: "#1e1038",
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
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: "#f5f3ff" }}
    >
      {/* Soft background blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Left decorative panel */}
      <div
        className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-14"
        style={{
          background:
            "linear-gradient(145deg, #1a0745 0%, #3b1589 45%, #7c3aed 100%)",
        }}
      >
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
          style={{ background: "rgba(192,132,252,0.25)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
          style={{ background: "rgba(217,70,239,0.2)", filter: "blur(70px)" }}
        />
        <div className="absolute top-12 right-12 w-28 h-28 rounded-full border border-white/10" />
        <div className="absolute top-20 right-20 w-14 h-14 rounded-full border border-white/10" />
        <div className="absolute bottom-28 left-10 w-20 h-20 rounded-full border border-white/10" />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            TaskFlow
          </span>
        </div>

        <div className="relative z-10">
          <p className="text-purple-300 text-sm font-semibold mb-3 uppercase tracking-[0.15em]">
            Team Task Manager
          </p>
          <h1 className="text-6xl font-black text-white mb-5 leading-[1.1]">
            Welcome
            <br />
            Back!
          </h1>
          <p className="text-purple-200 text-base leading-relaxed mb-10">
            Manage projects, track tasks, and
            <br />
            collaborate with your team.
          </p>
          <div className="space-y-3">
            {[
              "Drag-and-drop Kanban boards",
              "Role-based access control",
              "Real-time dashboard stats",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-purple-100 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative z-10 rounded-2xl px-5 py-4"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            ))}
          </div>
          <p className="text-white/85 text-sm italic">
            "The best task manager our team has ever used."
          </p>
          <p className="text-purple-300 text-xs mt-2 font-semibold">
            -Product Team, Startup Inc.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
              }}
            >
              <CheckSquare size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black" style={{ color: "#1e1038" }}>
              TaskFlow
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black" style={{ color: "#1e1038" }}>
              Sign In
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "#a78bfa" }}>
              Let's get you in
            </p>
          </div>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            {(["admin", "member"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemo(role)}
                className="flex-1 py-2 text-xs font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: "#ede9fe",
                  color: "#7c3aed",
                  borderRadius: "50px",
                  border: "1.5px solid #ddd6fe",
                }}
              >
                Demo {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
            <span className="text-xs font-medium" style={{ color: "#c4b5fd" }}>
              or sign in with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold mb-2 uppercase tracking-wide"
                style={{ color: "#7c3aed" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#c4b5fd" }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="admin@demo.com"
                  className="w-full pl-10 pr-4 py-3.5 text-sm placeholder-[#c4b5fd] outline-none transition-all"
                  style={inputStyle(errors.email)}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5 pl-3">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "#7c3aed" }}
                >
                  Password
                </label>
                <span
                  className="text-xs cursor-pointer transition-colors hover:text-purple-700"
                  style={{ color: "#c4b5fd" }}
                >
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#c4b5fd" }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 text-sm placeholder-[#c4b5fd] outline-none transition-all"
                  style={inputStyle(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#c4b5fd" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 pl-3">
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="accent-violet-600 w-4 h-4" />
              <span className="text-xs" style={{ color: "#a78bfa" }}>
                Remember me
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                borderRadius: "50px",
                boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
              }}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  <span>Sign In</span>
                  <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                    <ArrowRight size={13} />
                  </div>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-7" style={{ color: "#a78bfa" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold transition-colors hover:text-purple-900"
              style={{ color: "#7c3aed" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
