// src/components/DataForm.jsx
import { useState } from "react";

/**
 * Props:
 *   fields   – array of { key, label, type, placeholder, options (for select) }
 *   onSubmit – async fn(formData) → must throw on error
 *   onSuccess – callback after save, used to refresh table list
 */
export default function DataForm({ fields, onSubmit, onSuccess }) {
  const init = Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [form, setForm]       = useState(init);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setError(""); setSuccess("");
    // Basic validation
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

  return (
    <div>
      <div style={S.grid}>
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={S.label}>
              {f.label}
              {f.pk && <span style={S.pkBadge}>PK</span>}
            </label>

            {f.type === "select" ? (
              <select style={S.input} value={form[f.key]} onChange={set(f.key)}>
                <option value="">— Select —</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                style={S.input}
                type={f.type || "text"}
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder || ""}
              />
            )}
          </div>
        ))}
      </div>

      {error   && <p style={S.error}>{error}</p>}
      {success && <p style={S.success}>{success}</p>}

      <div style={S.actions}>
        <button style={S.btn} onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : "💾 Save to Database"}
        </button>
        <button style={S.ghost} onClick={() => { setForm(init); setError(""); setSuccess(""); }}>
          Clear
        </button>
      </div>
    </div>
  );
}

const S = {
  grid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" },
  label:   { display:"flex", alignItems:"center", gap:6, fontSize:"0.79rem", fontWeight:600, color:"#888899", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 },
  pkBadge: { background:"rgba(200,242,97,0.15)", color:"#c8f261", fontSize:"0.65rem", fontWeight:700, padding:"1px 6px", borderRadius:4 },
  input:   { width:"100%", background:"#0f0f11", border:"1px solid #2e2e38", borderRadius:8, padding:"12px 14px", color:"#f0f0f0", fontSize:"0.94rem", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  error:   { color:"#ff6b6b", fontSize:"0.88rem", margin:"8px 0" },
  success: { color:"#c8f261", fontSize:"0.88rem", margin:"8px 0" },
  actions: { display:"flex", gap:12, marginTop:8 },
  btn:     { background:"#c8f261", color:"#0f0f11", border:"none", borderRadius:8, padding:"13px 28px", fontFamily:"inherit", fontWeight:700, fontSize:"0.95rem", cursor:"pointer" },
  ghost:   { background:"transparent", color:"#888899", border:"1px solid #2e2e38", borderRadius:8, padding:"12px 22px", fontFamily:"inherit", fontSize:"0.93rem", cursor:"pointer" },
};
