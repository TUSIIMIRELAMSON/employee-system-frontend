// src/components/DataForm.jsx
import { useState } from "react";

export default function DataForm({ fields, onSubmit, onSuccess }) {
  const init = Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [form, setForm]       = useState(init);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setError(""); setSuccess("");
    for (const f of fields) {
      if (!form[f.key]) return setError(`"${f.label}" is required.`);
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

  function handleClear() {
    setForm(init);
    setError("");
    setSuccess("");
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
            ) : (
              <input
                className="form-input"
                type={f.type || "text"}
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
        <button className="btn-clear" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}
