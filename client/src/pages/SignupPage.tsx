import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CheckSquare,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const inputStyle = (error?: string): React.CSSProperties => ({
  background: "#f9f7ff",
  border: `1.5px solid ${error ? "#ef4444" : "#ddd6fe"}`,
  borderRadius: "50px",
  color: "#1e1038",
});

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
      style={{ background: "#f5f3ff" }}
    >
      {/* Soft background blobs */}
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
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
            "linear-gradient(145deg, #0e0530 0%, #2d1065 45%, #7e22ce 100%)",
        }}
      >
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{ background: "rgba(168,85,247,0.3)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full"
          style={{ background: "rgba(217,70,239,0.2)", filter: "blur(70px)" }}
        />
        <div className="absolute top-16 left-12 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute top-24 left-20 w-10 h-10 rounded-full border border-white/10" />
        <div className="absolute bottom-32 right-10 w-20 h-20 rounded-full border border-white/10" />

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
            Get started free
          </p>
          <h1 className="text-6xl font-black text-white mb-5 leading-[1.1]">
            Create
            <br />
            Account
          </h1>
          <p className="text-purple-200 text-base leading-relaxed mb-10">
            Join thousands of teams shipping faster
            <br />
            with TaskFlow's powerful toolkit.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "10k+", label: "Teams" },
              { num: "50k+", label: "Tasks done" },
              { num: "99.9%", label: "Uptime" },
              { num: "Free", label: "To start" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-white font-black text-xl">{s.num}</p>
                <p className="text-purple-300 text-xs mt-0.5">{s.label}</p>
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
            "Set up our entire team in under 5 minutes."
          </p>
          <p className="text-purple-300 text-xs mt-2 font-semibold">
            -Engineering Lead, TechCo
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-sm">
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
              Create Account
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "#a78bfa" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold transition-colors hover:text-purple-900"
                style={{ color: "#7c3aed" }}
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
            <span className="text-xs font-medium" style={{ color: "#c4b5fd" }}>
              create with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#ede9fe" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold mb-2 uppercase tracking-wide"
                style={{ color: "#7c3aed" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#c4b5fd" }}
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3.5 text-sm outline-none transition-all placeholder-[#c4b5fd]"
                  style={inputStyle(errors.name)}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1.5 pl-3">
                  {errors.name}
                </p>
              )}
            </div>

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
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3.5 text-sm outline-none transition-all placeholder-[#c4b5fd]"
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
              <label
                className="block text-xs font-bold mb-2 uppercase tracking-wide"
                style={{ color: "#7c3aed" }}
              >
                Password
              </label>
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
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-12 py-3.5 text-sm outline-none transition-all placeholder-[#c4b5fd]"
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
                "Creating…"
              ) : (
                <>
                  <span>Sign Up</span>
                  <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                    <ArrowRight size={13} />
                  </div>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-7" style={{ color: "#c4b5fd" }}>
            By signing up you agree to our{" "}
            <span
              className="cursor-pointer transition-colors hover:text-purple-700"
              style={{ color: "#a78bfa" }}
            >
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
