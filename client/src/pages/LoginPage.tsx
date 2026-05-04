import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckSquare, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const inputBase: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  color: "#0F172A",
};

const errInput: React.CSSProperties = {
  ...inputBase,
  border: "1px solid #F87171",
};

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
      const { data } = await api.post("/api/auth/login", form);
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
      style={{ background: "#F8FAFC" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex w-[44%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "#0F172A" }}
      >
        <div
          className="absolute top-0 right-0 w-px h-full"
          style={{ background: "#1E293B" }}
        />

        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#2563EB" }}
          >
            <CheckSquare size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">TaskFlow</span>
        </div>

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#2563EB" }}
          >
            Team Task Manager
          </p>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Welcome
            <br />
            back.
          </h1>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#64748B" }}
          >
            Manage projects, track tasks,
            <br />
            and collaborate with your team.
          </p>
          <div className="space-y-3">
            {[
              "Drag-and-drop Kanban boards",
              "Role-based access control",
              "Real-time dashboard stats",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "#2563EB" }}
                />
                <span className="text-sm" style={{ color: "#94A3B8" }}>
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl px-4 py-4"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400 text-sm">
                ★
              </span>
            ))}
          </div>
          <p className="text-sm italic" style={{ color: "#CBD5E1" }}>
            "The best task manager our team has ever used."
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: "#475569" }}>
            — Product Team, Startup Inc.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#2563EB" }}
            >
              <CheckSquare size={15} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: "#0F172A" }}>
              TaskFlow
            </span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold" style={{ color: "#0F172A" }}>
              Sign in
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            {(["admin", "member"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemo(role)}
                className="flex-1 py-2 text-xs font-medium transition-all hover:opacity-80 rounded-lg"
                style={{
                  background: "#F1F5F9",
                  color: "#475569",
                  border: "1px solid #E2E8F0",
                }}
              >
                Demo {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#374151" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="admin@demo.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm"
                  style={errors.email ? errInput : inputBase}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: "#374151" }}
                >
                  Password
                </label>
                <span
                  className="text-xs cursor-pointer transition-colors hover:text-blue-600"
                  style={{ color: "#94A3B8" }}
                >
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm"
                  style={errors.password ? errInput : inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                  style={{ color: "#9CA3AF" }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded"
                style={{ accentColor: "#2563EB" }}
              />
              <span className="text-xs" style={{ color: "#64748B" }}>
                Remember me
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-semibold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90 rounded-lg"
              style={{ background: "#0F172A" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#64748B" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold transition-colors hover:opacity-70"
              style={{ color: "#2563EB" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
