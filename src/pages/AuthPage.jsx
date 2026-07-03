import { useState, useMemo } from "react";
import { signup, signin } from "../api/api";

export default function AuthPage({ onLogin, company }) {
  const [mode, setMode]       = useState("signup");
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  const dots = useMemo(() => Array.from({ length: 32 }, () => 0.25 + Math.random() * 0.75), []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.name || !form.email || !form.password || !form.confirm)
          throw new Error("Please fill in all fields.");
        if (form.password.length < 6)
          throw new Error("Password must be at least 6 characters.");
        if (form.password !== form.confirm)
          throw new Error("Passwords do not match.");
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
          company_id: company.id,
        });
        setSuccess("Account created! Please sign in.");
        setMode("signin");
        setForm((f) => ({ ...f, name:"", password:"", confirm:"" }));
      } else {
        if (!form.email || !form.password)
          throw new Error("Please fill in both fields.");

        const data = await signin({
          email: form.email,
          password: form.password,
          company_id: company.id,
        });
        localStorage.setItem("emp_token", data.token);
        localStorage.setItem("emp_user",  JSON.stringify(data.user));
        onLogin(data.user);
      }

    } catch (e) {
      if (e.message.includes("locked")) {
        setLocked(true);
      } else {
        setLocked(false);
      }
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="auth-page">
      <div className="auth-split">

        <div className="auth-brand">
          <div>
            <div className="auth-brand-top">
              <div className="auth-brand-icon">🏢</div>
              <span className="auth-brand-name">{company.company_name}</span>
            </div>
            <h1 className="auth-brand-headline">Your team,<br />organized in<br />one place.</h1>
            <p className="auth-brand-sub">
              Attendance, records, and reporting for every department, in a single dashboard.
            </p>
          </div>
          <div className="auth-brand-grid">
            {dots.map((op, i) => (
              <div key={i} className="auth-brand-dot" style={{ opacity: op }} />
            ))}
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">●</span>
            <h1 className="auth-title">{mode === "signup" ? "Create Account" : "Welcome Back"}</h1>
            <p className="auth-sub">
              {mode === "signup" ? "Sign up once. Come back anytime." : "Sign in with your credentials."}
            </p>
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={form.name}
                onChange={set("name")} onKeyDown={handleKey} placeholder="Your full name" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email}
              onChange={set("email")} onKeyDown={handleKey} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password}
              onChange={set("password")} onKeyDown={handleKey} placeholder="At least 6 characters" />
          </div>
          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" value={form.confirm}
                onChange={set("confirm")} onKeyDown={handleKey} placeholder="Repeat your password" />
            </div>
          )}

          {error && (
            <div style={{
              background: locked ? "rgba(220,38,38,0.08)" : "transparent",
              border: locked ? "1px solid rgba(220,38,38,0.3)" : "none",
              borderRadius: locked ? 8 : 0,
              padding: locked ? "12px 16px" : 0,
              marginBottom: 12,
            }}>
              {locked && <p style={{ fontSize:"1.2rem", marginBottom:4 }}>🔒</p>}
              <p className="msg-error">{error}</p>
              {locked && (
                <p style={{ fontSize:"0.78rem", color:"var(--muted)", marginTop:4 }}>
                  Contact your admin to unlock your account early.
                </p>
              )}
            </div>
          )}
          {success && <p className="msg-success">{success}</p>}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
          </button>

          <p className="switch-text">
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button className="switch-link" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setSuccess(""); setLocked(false); }}>
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <p className="switch-text" style={{ marginTop: 12 }}>
            <button className="switch-link" style={{ color: "var(--muted)", fontSize: "0.82rem" }}
              onClick={() => {
                localStorage.removeItem("emp_company");
                window.location.reload();
              }}>
              ← Change company
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}