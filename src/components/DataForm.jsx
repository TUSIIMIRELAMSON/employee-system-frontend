// src/components/DataForm.jsx
import { useState } from "react";

function isValidDate(val) {
  return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime());
}

// Formats input automatically as user types: 19900515 → 1990-05-15
function formatDateInput(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0,4)}-${digits.slice(4)}`;
  return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
}

function DateInput({ value, onChange, label }) {
  function handleChange(e) {
    const formatted = formatDateInput(e.target.value);
    onChange(formatted);
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        className="form-input"
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder="YYYY-MM-DD"
        maxLength={10}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        data-date="true"
        style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
      />
      <span style={{
        position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
        fontSize:"0.75rem", color:"#888899", pointerEvents:"none"
      }}>
        📅
      </span>
    </div>
  );
}

export default function DataForm({ fields, onSubmit, onSuccess }) {
  const init = Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [form, setForm]       = useState(init);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setDate = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));

  async function handleSave() {
    setError(""); setSuccess("");
    for (const f of fields) {
      if (!form[f.key]) return setError(`"${f.label}" is required.`);
      if (f.type === "date" && !isValidDate(form[f.key])) {
        return setError(`"${f.label}" must be YYYY-MM-DD (e.g. 1990-05-15)`);
      }
    }
    setLoading(true);
    try {
      await onSubmit(form);
      setSuccess("✓ Saved to database successfully!");
      setForm(init);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="form-grid">
        {fields.map((f) => (
          <div key={f.key} className="form-group">
            <label className="form-label">
              {f.label}
              {f.pk && <span className="pk-badge">PK</span>}
            </label>

            {f.type === "select" ? (
              <select className="form-input" value={form[f.key]} onChange={set(f.key)}>
                <option value="">— Select —</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "date" ? (
              <DateInput
                value={form[f.key]}
                onChange={setDate(f.key)}
                label={f.label}
              />
            ) : (
              <input
                className="form-input"
                type={f.type === "number" ? "number" : "text"}
                inputMode={f.type === "number" ? "numeric" : "text"}
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder || ""}
              />
            )}
          </div>
        ))}
      </div>

      {error   && <p className="msg-error">{error}</p>}
      {success && <p className="msg-success">{success}</p>}

      <div className="form-actions">
        <button className="btn-save" onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : "💾 Save to Database"}
        </button>
        <button className="btn-clear" onClick={() => { setForm(init); setError(""); setSuccess(""); }}>
          Clear
        </button>
      </div>
    </div>
  );
}
