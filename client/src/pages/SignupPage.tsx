import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckSquare, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      login(data.token, data.user);
      toast.success(`Welcome to TaskFlow, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Signup failed",
      );
    } finally {
      setLoading(false);
    }
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
            Get started free
          </p>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Create
            <br />
            account.
          </h1>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "#64748B" }}
          >
            Join teams shipping faster with
            <br />
            TaskFlow's collaborative toolkit.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "10k+", label: "Active teams" },
              { num: "50k+", label: "Tasks done" },
              { num: "99.9%", label: "Uptime" },
              { num: "Free", label: "To start" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center"
                style={{ background: "#1E293B", border: "1px solid #334155" }}
              >
                <p className="text-white font-bold text-lg">{s.num}</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                  {s.label}
                </p>
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
            "Set up our entire team in under 5 minutes."
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: "#475569" }}>
            — Engineering Lead, TechCo
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
              Create account
            </h2>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#2563EB" }}
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              sign up with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#374151" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-4 py-2.5 text-sm"
                  style={errors.name ? errInput : inputBase}
                />
              </div>
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.name}
                </p>
              )}
            </div>

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
                  placeholder="you@example.com"
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
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Min. 6 characters"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-semibold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90 rounded-lg"
              style={{ background: "#0F172A" }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#94A3B8" }}>
            By signing up you agree to our{" "}
            <span
              className="font-medium cursor-pointer"
              style={{ color: "#64748B" }}
            >
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
