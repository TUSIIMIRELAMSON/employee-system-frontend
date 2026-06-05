// src/pages/OnboardingForm.jsx
import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function DateInput({ value, onChange, placeholder }) {
  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let f = digits;
    if (digits.length > 4) f = `${digits.slice(0,4)}-${digits.slice(4)}`;
    if (digits.length > 6) f = `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
    onChange(f);
  }
  return (
    <input className="form-input" type="text" inputMode="numeric"
      value={value} onChange={handleChange}
      placeholder={placeholder || "YYYY-MM-DD"} maxLength={10} />
  );
}

export default function OnboardingForm() {
  const token = window.location.pathname.split("/onboarding/")[1];

  const [company,  setCompany]  = useState(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [done,     setDone]     = useState(false);

  const [form, setForm] = useState({
    first_name: "", last_name: "", gender: "",
    birth_date: "", address: "", phone: "", email: "",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setDate = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!token) { setError("Invalid link."); setLoading(false); return; }
    fetch(`${API}/api/onboarding/${token}`)
      .then(r => r.json())
      .then(j => {
        if (j.status === "ok") setCompany(j.data);
        else setError(j.message);
      })
      .catch(() => setError("Could not load form. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit() {
    setError("");
    const required = ["first_name","last_name","gender","birth_date","phone","email"];
    for (const k of required) {
      if (!form[k]) return setError(`Please fill in ${k.replace("_"," ")}.`);
    }
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/onboarding/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

  if (loading) return (
    <div className="onboarding-page">
      <p style={{ color: "#888899" }}>Loading form…</p>
    </div>
  );

  if (error && !company) return (
    <div className="onboarding-page">
      <div className="onboarding-card" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 48 }}>❌</span>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", marginTop: 16, color: "#f0f0f0" }}>
          Invalid Link
        </h2>
        <p style={{ color: "#888899", marginTop: 8 }}>{error}</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-success">
          <span className="onboarding-success-icon">✅</span>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.8rem", color: "#f0f0f0", marginBottom: 12 }}>
            Submitted Successfully!
          </h2>
          <p style={{ color: "#888899", marginBottom: 8 }}>
            Your details have been sent to <strong style={{ color: "#c8f261" }}>{company?.company_name}</strong>.
          </p>
          <p style={{ color: "#888899", fontSize: "0.88rem" }}>
            The manager will complete your registration shortly. You will be contacted via email.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 28, color: "#c8f261" }}>◆</span>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.8rem", color: "#f0f0f0", margin: "8px 0 4px" }}>
            Employee Registration
          </h1>
          <p style={{ color: "#888899", fontSize: "0.88rem" }}>
            {company?.company_name} — Please fill in your personal details
          </p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">First Name <span style={{color:"#ff6b6b"}}>*</span></label>
            <input className="form-input" type="text"
              value={form.first_name} onChange={set("first_name")} placeholder="John" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name <span style={{color:"#ff6b6b"}}>*</span></label>
            <input className="form-input" type="text"
              value={form.last_name} onChange={set("last_name")} placeholder="Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Gender <span style={{color:"#ff6b6b"}}>*</span></label>
            <select className="form-input" value={form.gender} onChange={set("gender")}>
              <option value="">— Select —</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth <span style={{color:"#ff6b6b"}}>*</span></label>
            <DateInput value={form.birth_date} onChange={setDate("birth_date")} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone <span style={{color:"#ff6b6b"}}>*</span></label>
            <input className="form-input" type="text"
              value={form.phone} onChange={set("phone")} placeholder="+82 10-0000-0000" />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{color:"#ff6b6b"}}>*</span></label>
            <input className="form-input" type="email"
              value={form.email} onChange={set("email")} placeholder="you@email.com" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input className="form-input" type="text"
            value={form.address} onChange={set("address")} placeholder="Your full address" />
        </div>

        {error && <p className="msg-error">{error}</p>}

        <button className="btn-primary" onClick={handleSubmit} disabled={saving}
          style={{ marginTop: 8 }}>
          {saving ? "Submitting…" : "Submit My Details →"}
        </button>
      </div>
    </div>
  );
}