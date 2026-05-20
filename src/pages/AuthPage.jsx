// src/pages/AuthPage.jsx
import { useState } from "react";
import { signup, signin } from "../api/api";

export default function AuthPage({ onLogin }) {
  const [mode, setMode]       = useState("signup"); // "signup" | "signin"
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
        await signup({ name: form.name, email: form.email, password: form.password });
        setSuccess("Account created! Please sign in.");
        setMode("signin");
        setForm((f) => ({ ...f, name:"", password:"", confirm:"" }));
      } else {
        if (!form.email || !form.password)
          throw new Error("Please fill in both fields.");
        const data = await signin({ email: form.email, password: form.password });
        localStorage.setItem("emp_token", data.token);
        localStorage.setItem("emp_user",  JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.dot}>◆</div>
          <h1 style={S.h1}>{mode === "signup" ? "Create Account" : "Welcome Back"}</h1>
          <p style={S.sub}>{mode === "signup" ? "Sign up once. Come back anytime." : "Sign in with your credentials."}</p>
        </div>

        {/* Fields */}
        {mode === "signup" && <Field label="Full Name"    value={form.name}     onChange={set("name")}    placeholder="Your full name" />}
        <Field label="Email Address" value={form.email}    onChange={set("email")}    placeholder="you@example.com" type="email" />
        <Field label="Password"      value={form.password} onChange={set("password")} placeholder="At least 6 characters" type="password" />
        {mode === "signup" && <Field label="Confirm Password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat your password" type="password" />}

        {/* Messages */}
        {error   && <p style={S.error}>{error}</p>}
        {success && <p style={S.success}>{success}</p>}

        {/* Submit */}
        <button style={S.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
        </button>

        {/* Switch */}
        <p style={S.switchText}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <span style={S.link} onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setSuccess(""); }}>
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

const S = {
  page:       { minHeight:"100vh", background:"#0f0f11", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans',sans-serif" },
  card:       { background:"#1a1a1f", border:"1px solid #2e2e38", borderRadius:14, padding:"40px 36px", width:"100%", maxWidth:440, boxShadow:"0 24px 64px rgba(0,0,0,0.5)" },
  header:     { textAlign:"center", marginBottom:28 },
  dot:        { color:"#c8f261", fontSize:26, marginBottom:10 },
  h1:         { fontFamily:"'DM Serif Display',serif", fontSize:"2rem", fontWeight:400, color:"#f0f0f0", margin:"0 0 6px" },
  sub:        { color:"#888899", fontSize:"0.94rem", margin:0 },
  label:      { display:"block", fontSize:"0.8rem", fontWeight:600, color:"#888899", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 },
  input:      { width:"100%", background:"#0f0f11", border:"1px solid #2e2e38", borderRadius:8, padding:"12px 15px", color:"#f0f0f0", fontSize:"0.96rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btn:        { width:"100%", background:"#c8f261", color:"#0f0f11", border:"none", borderRadius:8, padding:14, fontFamily:"inherit", fontSize:"0.97rem", fontWeight:700, cursor:"pointer", marginTop:8, marginBottom:18 },
  switchText: { textAlign:"center", fontSize:"0.88rem", color:"#888899", margin:0 },
  link:       { color:"#c8f261", cursor:"pointer", fontWeight:600 },
  error:      { color:"#ff6b6b", fontSize:"0.88rem", marginBottom:10 },
  success:    { color:"#c8f261", fontSize:"0.88rem", marginBottom:10 },
};
