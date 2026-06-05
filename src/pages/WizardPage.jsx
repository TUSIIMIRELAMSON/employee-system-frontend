// src/pages/WizardPage.jsx
import { useState } from "react";
import { employeeWizard } from "../api/api";

const ROLES = ["Worker", "Manager", "Researcher", "Accountant", "HR Officer", "Other"];

function DateInput({ value, onChange, placeholder }) {
  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0,4)}-${digits.slice(4)}`;
    if (digits.length > 6) formatted = `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
    onChange(formatted);
  }
  return (
    <input className="form-input" type="text" inputMode="numeric"
      value={value} onChange={handleChange}
      placeholder={placeholder || "YYYY-MM-DD"} maxLength={10} />
  );
}

export default function WizardPage({ departments, onSuccess, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    // Step 1 — Personal
    emp_no: "", birth_date: "", first_name: "", last_name: "",
    gender: "", hire_date: "",
    // Step 2 — Department & Role
    dept_no: "", employee_role: "", from_date: "", to_date: "",
    email: "",
    // Step 3 — Salary
    salary: "", salary_from: "", salary_to: "",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setDate = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  // ── Validation per step ──────────────────────
  function validateStep(s) {
    setError("");
    if (s === 1) {
      if (!form.emp_no)     return setError("Employee number is required."), false;
      if (!form.first_name) return setError("First name is required."), false;
      if (!form.last_name)  return setError("Last name is required."), false;
      if (!form.gender)     return setError("Gender is required."), false;
      if (!form.birth_date) return setError("Date of birth is required."), false;
      if (!form.hire_date)  return setError("Hire date is required."), false;
    }
    if (s === 2) {
      if (!form.dept_no)       return setError("Please select a department."), false;
      if (!form.employee_role) return setError("Please select a role."), false;
      if (!form.from_date)     return setError("From date is required."), false;
      if (!form.to_date)       return setError("To date is required."), false;
      if (form.employee_role === "Manager" && !form.email)
        return setError("Email is required for manager approval."), false;
    }
    if (s === 3) {
      if (!form.salary)      return setError("Salary is required."), false;
      if (!form.salary_from) return setError("Salary from date is required."), false;
      if (!form.salary_to)   return setError("Salary to date is required."), false;
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  // ── Submit ───────────────────────────────────
  async function handleSubmit() {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      const dept = departments.find(d => d.dept_no === form.dept_no);
      const result = await employeeWizard({
        ...form,
        dept_name: dept?.dept_name || form.dept_no,
      });
      onSuccess(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Personal", "Dept & Role", "Salary", "Review"];

  return (
    <div className="wizard-overlay" onClick={onClose}>
      <div className="wizard-box" onClick={e => e.stopPropagation()}>

        {/* Step indicators */}
        <div className="wizard-steps">
          {stepLabels.map((label, i) => (
            <>
              <div key={i} className={`wizard-step ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>
                <div className="wizard-step-num">{step > i+1 ? "✓" : i+1}</div>
                <span className="wizard-step-label">{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div className="wizard-divider" />}
            </>
          ))}
        </div>

        {/* ── STEP 1: Personal Details ── */}
        {step === 1 && (
          <>
            <h3 className="wizard-title">Personal Details</h3>
            <p className="wizard-sub">Basic employee information</p>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Employee No</label>
                <input className="form-input" type="number"
                  value={form.emp_no} onChange={set("emp_no")} placeholder="e.g. 10001" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" value={form.gender} onChange={set("gender")}>
                  <option value="">— Select —</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" type="text"
                  value={form.first_name} onChange={set("first_name")} placeholder="John" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" type="text"
                  value={form.last_name} onChange={set("last_name")} placeholder="Smith" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <DateInput value={form.birth_date} onChange={setDate("birth_date")} />
              </div>
              <div className="form-group">
                <label className="form-label">Hire Date</label>
                <DateInput value={form.hire_date} onChange={setDate("hire_date")} />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: Department & Role ── */}
        {step === 2 && (
          <>
            <h3 className="wizard-title">Department & Role</h3>
            <p className="wizard-sub">Assign department and job role</p>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input" value={form.dept_no} onChange={set("dept_no")}>
                  <option value="">— Select Department —</option>
                  {departments.map(d => (
                    <option key={d.dept_no} value={d.dept_no}>{d.dept_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employee Role</label>
                <select className="form-input" value={form.employee_role} onChange={set("employee_role")}>
                  <option value="">— Select Role —</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">From Date</label>
                <DateInput value={form.from_date} onChange={setDate("from_date")} />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <DateInput value={form.to_date} onChange={setDate("to_date")} />
              </div>
            </div>
            {form.employee_role === "Manager" && (
              <div className="form-group">
                <label className="form-label">Manager Email (for approval)</label>
                <input className="form-input" type="email"
                  value={form.email} onChange={set("email")}
                  placeholder="manager@company.com" />
                <p style={{ fontSize: "0.78rem", color: "#f59e0b", marginTop: 6 }}>
                  ⚠️ Manager role requires admin approval before access is granted.
                </p>
              </div>
            )}
          </>
        )}

        {/* ── STEP 3: Salary ── */}
        {step === 3 && (
          <>
            <h3 className="wizard-title">Salary Details</h3>
            <p className="wizard-sub">Set salary for this employee</p>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Salary Amount</label>
                <input className="form-input" type="number"
                  value={form.salary} onChange={set("salary")} placeholder="e.g. 75000" />
              </div>
              <div className="form-group" style={{ visibility: "hidden" }} />
              <div className="form-group">
                <label className="form-label">From Date</label>
                <DateInput value={form.salary_from} onChange={setDate("salary_from")} />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <DateInput value={form.salary_to} onChange={setDate("salary_to")} />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 4: Review ── */}
        {step === 4 && (
          <>
            <h3 className="wizard-title">Review & Confirm</h3>
            <p className="wizard-sub">Please review before saving</p>
            <div className="review-grid">
              <div className="review-item">
                <div className="review-item-label">Employee No</div>
                <div className="review-item-value">{form.emp_no}</div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Full Name</div>
                <div className="review-item-value">{form.first_name} {form.last_name}</div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Gender</div>
                <div className="review-item-value">{form.gender === "M" ? "Male" : "Female"}</div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Date of Birth</div>
                <div className="review-item-value">{form.birth_date}</div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Hire Date</div>
                <div className="review-item-value">{form.hire_date}</div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Department</div>
                <div className="review-item-value">
                  {departments.find(d => d.dept_no === form.dept_no)?.dept_name || form.dept_no}
                </div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Role</div>
                <div className="review-item-value">
                  {form.employee_role}
                  {form.employee_role === "Manager" && (
                    <span className="role-badge-manager">Pending Approval</span>
                  )}
                </div>
              </div>
              <div className="review-item">
                <div className="review-item-label">Salary</div>
                <div className="review-item-value">${Number(form.salary).toLocaleString()}</div>
              </div>
            </div>
            {form.employee_role === "Manager" && (
              <div style={{
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 16,
              }}>
                <p style={{ fontSize: "0.85rem", color: "#f59e0b" }}>
                  ⚠️ This employee is registered as a Manager. Their account will be <strong>pending admin approval</strong> before they receive manager-level access.
                </p>
              </div>
            )}
          </>
        )}

        {error && <p className="msg-error">{error}</p>}

        {/* Actions */}
        <div className="wizard-actions">
          {step > 1 && (
            <button className="btn-wizard-back" onClick={() => { setStep(s => s-1); setError(""); }}>
              ← Back
            </button>
          )}
          {step < 4 && (
            <button className="btn-wizard-next" onClick={nextStep}>
              Next →
            </button>
          )}
          {step === 4 && (
            <button className="btn-wizard-next" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving…" : "✅ Save Employee"}
            </button>
          )}
          <button className="btn-wizard-back" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}