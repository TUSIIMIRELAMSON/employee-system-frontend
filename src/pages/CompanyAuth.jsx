// src/pages/CompanyAuth.jsx
import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function CompanyAuth({ onCompanyVerified }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [step, setStep] = useState(1); // register has 2 steps
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ registration_number: "", secret_code: "" });

  // Register form
  const [regForm, setRegForm] = useState({
    registration_number: "",
    company_name: "",
    business_type: "",
    business_address: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    business_activities: "",
    secret_code: "",
    confirm_secret: "",
  });

  const setLogin = (k) => (e) => setLoginForm(f => ({ ...f, [k]: e.target.value }));
  const setReg   = (k) => (e) => setRegForm(f => ({ ...f, [k]: e.target.value }));

  // ── Company Login ────────────────────────────
  async function handleLogin() {
    setError(""); setSuccess("");
    if (!loginForm.registration_number || !loginForm.secret_code)
      return setError("Please fill in both fields.");

    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/company/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      // Save company to localStorage
      localStorage.setItem("emp_company", JSON.stringify(json.data));
      onCompanyVerified(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Company Register Step 1 ──────────────────
  function handleRegStep1() {
    setError("");
    if (!regForm.registration_number || !regForm.company_name)
      return setError("Registration number and company name are required.");
    if (!regForm.owner_name || !regForm.owner_email)
      return setError("Owner name and email are required.");
    setStep(2);
  }

  // ── Company Register Step 2 ──────────────────
  async function handleRegister() {
    setError(""); setSuccess("");
    if (!regForm.secret_code)
      return setError("Please set a secret code.");
    if (regForm.secret_code !== regForm.confirm_secret)
      return setError("Secret codes do not match.");
    if (regForm.secret_code.length < 6)
      return setError("Secret code must be at least 6 characters.");

    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/company/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setSuccess("Company registered! Please sign in with your registration number.");
      setMode("login");
      setStep(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: mode === "register" ? 520 : 440 }}>

        {/* Header */}
        <div className="auth-header">
          <span className="auth-logo">◆</span>
          <h1 className="auth-title">
            {mode === "login" ? "Company Sign In" : step === 1 ? "Register Company" : "Set Secret Code"}
          </h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Enter your business registration number and secret code"
              : step === 1
              ? "Fill in your company details"
              : "Set a secret code to protect your company account"}
          </p>
        </div>

        {/* ── LOGIN FORM ── */}
        {mode === "login" && (
          <>
            <div className="form-group">
              <label className="form-label">Business Registration Number</label>
              <input className="form-input" type="text"
                value={loginForm.registration_number}
                onChange={setLogin("registration_number")}
                placeholder="e.g. BRN-2024-001"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Secret Code</label>
              <input className="form-input" type="password"
                value={loginForm.secret_code}
                onChange={setLogin("secret_code")}
                placeholder="Your company secret code"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {error   && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            <button className="btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? "Verifying…" : "Enter System"}
            </button>
            <p className="switch-text">
              New company?{" "}
              <button className="switch-link" onClick={() => { setMode("register"); setError(""); setSuccess(""); }}>
                Register here
              </button>
            </p>
          </>
        )}

        {/* ── REGISTER FORM STEP 1 ── */}
        {mode === "register" && step === 1 && (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Registration Number <span style={{color:"#ff6b6b"}}>*</span></label>
                <input className="form-input" type="text"
                  value={regForm.registration_number}
                  onChange={setReg("registration_number")}
                  placeholder="e.g. BRN-2024-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name <span style={{color:"#ff6b6b"}}>*</span></label>
                <input className="form-input" type="text"
                  value={regForm.company_name}
                  onChange={setReg("company_name")}
                  placeholder="e.g. McLAM GROUP"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <input className="form-input" type="text"
                  value={regForm.business_type}
                  onChange={setReg("business_type")}
                  placeholder="e.g. Technology, Restaurant"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name <span style={{color:"#ff6b6b"}}>*</span></label>
                <input className="form-input" type="text"
                  value={regForm.owner_name}
                  onChange={setReg("owner_name")}
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Email <span style={{color:"#ff6b6b"}}>*</span></label>
                <input className="form-input" type="email"
                  value={regForm.owner_email}
                  onChange={setReg("owner_email")}
                  placeholder="owner@company.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Phone</label>
                <input className="form-input" type="text"
                  value={regForm.owner_phone}
                  onChange={setReg("owner_phone")}
                  placeholder="+82 10-0000-0000"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Business Address</label>
              <input className="form-input" type="text"
                value={regForm.business_address}
                onChange={setReg("business_address")}
                placeholder="Full business address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Business Activities</label>
              <input className="form-input" type="text"
                value={regForm.business_activities}
                onChange={setReg("business_activities")}
                placeholder="e.g. Software development, consulting"
              />
            </div>
            {error && <p className="msg-error">{error}</p>}
            <button className="btn-primary" onClick={handleRegStep1}>
              Next →
            </button>
            <p className="switch-text">
              Already registered?{" "}
              <button className="switch-link" onClick={() => { setMode("login"); setError(""); setStep(1); }}>
                Sign In
              </button>
            </p>
          </>
        )}

        {/* ── REGISTER FORM STEP 2 ── */}
        {mode === "register" && step === 2 && (
          <>
            <div style={{
              background: "rgba(200,242,97,0.08)", border: "1px solid rgba(200,242,97,0.2)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20
            }}>
              <p style={{ fontSize: "0.82rem", color: "#888899", marginBottom: 4 }}>Registering as</p>
              <p style={{ fontSize: "0.95rem", color: "#f0f0f0", fontWeight: 600 }}>{regForm.company_name}</p>
              <p style={{ fontSize: "0.82rem", color: "#888899" }}>{regForm.registration_number}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Secret Code <span style={{color:"#ff6b6b"}}>*</span></label>
              <input className="form-input" type="password"
                value={regForm.secret_code}
                onChange={setReg("secret_code")}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Secret Code <span style={{color:"#ff6b6b"}}>*</span></label>
              <input className="form-input" type="password"
                value={regForm.confirm_secret}
                onChange={setReg("confirm_secret")}
                placeholder="Repeat secret code"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
            <p style={{ fontSize: "0.82rem", color: "#888899", marginBottom: 16 }}>
              ⚠️ Keep this code safe — it is required every time your company logs in.
            </p>
            {error   && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" onClick={handleRegister} disabled={loading} style={{ marginBottom: 0 }}>
                {loading ? "Registering…" : "Complete Registration"}
              </button>
              <button style={{
                background: "transparent", border: "1px solid #2e2e38", color: "#888899",
                borderRadius: 8, padding: "13px 20px", cursor: "pointer", fontFamily: "inherit"
              }} onClick={() => setStep(1)}>
                ← Back
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
