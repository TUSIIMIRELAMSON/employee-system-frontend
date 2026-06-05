// src/pages/SubmissionsPage.jsx
import { useState, useEffect } from "react";
import { getSubmissions, completeFromSubmission } from "../api/api";
import { getDepartments } from "../api/api";

const ROLES = ["Worker", "Manager", "Researcher", "Accountant", "HR Officer", "Other"];

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

export default function SubmissionsPage({ onRefresh }) {
  const [submissions,  setSubmissions]  = useState([]);
  const [departments,  setDepartments]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [completing,   setCompleting]   = useState(null); // token of submission being completed
  const [compForm,     setCompForm]     = useState({});
  const [msg,          setMsg]          = useState("");
  const [error,        setError]        = useState("");

  useEffect(() => {
    Promise.all([getSubmissions(), getDepartments()])
      .then(([subs, depts]) => {
        setSubmissions(subs || []);
        setDepartments(depts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  function openComplete(sub) {
    setCompleting(sub.token);
    setCompForm({
      emp_no: "", hire_date: "", dept_no: "",
      employee_role: "", from_date: "", to_date: "",
      salary: "", salary_from: "", salary_to: "",
    });
    setError("");
  }

  async function handleComplete() {
    setError("");
    const required = ["emp_no","hire_date","dept_no","employee_role",
                      "from_date","to_date","salary","salary_from","salary_to"];
    for (const k of required) {
      if (!compForm[k]) return setError(`Please fill in ${k.replace(/_/g," ")}.`);
    }
    try {
      const result = await completeFromSubmission(completing, compForm);
      setMsg(`✅ Employee registered! ID: ${result?.auto_emp_id || "assigned"}`);
      setCompleting(null);
      const subs = await getSubmissions();
      setSubmissions(subs || []);
      if (onRefresh) onRefresh();
    } catch (e) {
      setError(e.message);
    }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }

  if (loading) return <p style={{color:"#888899"}}>Loading submissions…</p>;

  return (
    <div>
      <h2 className="panel-title">📥 Employee Submissions</h2>
      <p className="panel-sub">Employees who filled the onboarding form — complete their registration below</p>

      {msg && <p style={{ color:"#c8f261", marginBottom:16, fontSize:"0.88rem" }}>{msg}</p>}

      {submissions.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"#888899" }}>
          <span style={{ fontSize:48, display:"block", marginBottom:12 }}>📭</span>
          <p>No pending submissions yet.</p>
          <p style={{ fontSize:"0.82rem", marginTop:6 }}>Generate a QR code and share it with new employees.</p>
        </div>
      ) : (
        submissions.map(sub => (
          <div key={sub.id} className="submission-card">
            <div className="submission-header">
              <div className="submission-name">
                👤 {sub.first_name} {sub.last_name}
              </div>
              <span style={{ fontSize:"0.78rem", color:"#888899" }}>
                Submitted: {formatDate(sub.submitted_at)}
              </span>
            </div>

            <div className="submission-grid">
              <div className="submission-item">
                <div className="submission-item-label">Gender</div>
                <div className="submission-item-value">{sub.gender === "M" ? "Male" : "Female"}</div>
              </div>
              <div className="submission-item">
                <div className="submission-item-label">Date of Birth</div>
                <div className="submission-item-value">{sub.birth_date || "—"}</div>
              </div>
              <div className="submission-item">
                <div className="submission-item-label">Phone</div>
                <div className="submission-item-value">{sub.phone || "—"}</div>
              </div>
              <div className="submission-item">
                <div className="submission-item-label">Email</div>
                <div className="submission-item-value">{sub.email || "—"}</div>
              </div>
              {sub.address && (
                <div className="submission-item" style={{ gridColumn:"1/-1" }}>
                  <div className="submission-item-label">Address</div>
                  <div className="submission-item-value">{sub.address}</div>
                </div>
              )}
            </div>

            {completing === sub.token ? (
              <div style={{ borderTop:"1px solid var(--border)", paddingTop:16, marginTop:8 }}>
                <p style={{ fontSize:"0.82rem", fontWeight:600, color:"#c8f261", marginBottom:14 }}>
                  Complete Registration
                </p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Employee No</label>
                    <input className="form-input" type="number"
                      value={compForm.emp_no}
                      onChange={e => setCompForm(f=>({...f,emp_no:e.target.value}))}
                      placeholder="e.g. 10001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hire Date</label>
                    <DateInput value={compForm.hire_date}
                      onChange={v => setCompForm(f=>({...f,hire_date:v}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-input" value={compForm.dept_no}
                      onChange={e => setCompForm(f=>({...f,dept_no:e.target.value}))}>
                      <option value="">— Select —</option>
                      {departments.map(d => (
                        <option key={d.dept_no} value={d.dept_no}>{d.dept_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-input" value={compForm.employee_role}
                      onChange={e => setCompForm(f=>({...f,employee_role:e.target.value}))}>
                      <option value="">— Select —</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <DateInput value={compForm.from_date}
                      onChange={v => setCompForm(f=>({...f,from_date:v}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <DateInput value={compForm.to_date}
                      onChange={v => setCompForm(f=>({...f,to_date:v}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary</label>
                    <input className="form-input" type="number"
                      value={compForm.salary}
                      onChange={e => setCompForm(f=>({...f,salary:e.target.value}))}
                      placeholder="e.g. 75000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary From</label>
                    <DateInput value={compForm.salary_from}
                      onChange={v => setCompForm(f=>({...f,salary_from:v}))} />
                  </div>
                  <div className="form-group" style={{gridColumn:"1/-1"}}>
                    <label className="form-label">Salary To</label>
                    <DateInput value={compForm.salary_to}
                      onChange={v => setCompForm(f=>({...f,salary_to:v}))} />
                  </div>
                </div>
                {error && <p className="msg-error">{error}</p>}
                <div className="form-actions">
                  <button className="btn-save" onClick={handleComplete}>
                    ✅ Complete Registration
                  </button>
                  <button className="btn-clear" onClick={() => setCompleting(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-save" onClick={() => openComplete(sub)}
                style={{ width:"auto" }}>
                Complete Registration →
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}