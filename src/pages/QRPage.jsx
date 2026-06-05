// src/pages/QRPage.jsx
import { useState, useEffect } from "react";
import { generateOnboardingLink } from "../api/api";

const BASE_URL = window.location.origin;

export default function QRPage({ company }) {
  const [link,    setLink]    = useState("");
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [qrSrc,   setQrSrc]   = useState("");

  async function handleGenerate() {
    setLoading(true);
    try {
      const data = await generateOnboardingLink();
      const url  = `${BASE_URL}/onboarding/${data.token}`;
      setLink(url);
      setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);
    } catch (e) {
      alert("Failed to generate link: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <h2 className="panel-title">📲 QR Code Onboarding</h2>
      <p className="panel-sub">
        Generate a QR code and share it with new employees. They scan it, fill their details,
        and you complete their registration from the 📥 Submissions tab.
      </p>

      <div className="qr-box">
        <h3>Generate Onboarding Link</h3>
        <p>Each QR code is unique and can only be used once.</p>

        {!link ? (
          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating…" : "🔗 Generate QR Code"}
          </button>
        ) : (
          <>
            <div className="qr-image-wrap">
              <img src={qrSrc} alt="QR Code" width={200} height={200} />
            </div>
            <div className="qr-link">{link}</div>
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-save" onClick={handleCopy} style={{ flex:1 }}>
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
              <button className="btn-clear" onClick={() => {
                setLink(""); setQrSrc("");
              }}>
                New
              </button>
            </div>
            <p style={{ fontSize:"0.78rem", color:"#888899", marginTop:12 }}>
              Share this QR code or link with the employee. Once they submit, check the 📥 Submissions tab.
            </p>
          </>
        )}
      </div>

      {/* How it works */}
      <div style={{ maxWidth:500, margin:"0 auto" }}>
        <p className="records-label">How it works</p>
        {[
          ["1️⃣", "Click Generate QR Code above"],
          ["2️⃣", "Share the QR code or link with the new employee"],
          ["3️⃣", "Employee scans and fills their personal details"],
          ["4️⃣", "Go to 📥 Submissions tab to complete their registration"],
          ["5️⃣", "Employee is fully registered with auto-generated ID"],
        ].map(([icon, text]) => (
          <div key={text} style={{
            display:"flex", alignItems:"center", gap:12,
            padding:"10px 14px", marginBottom:8,
            background:"var(--surface)", borderRadius:8,
            border:"1px solid var(--border)"
          }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:"0.88rem", color:"var(--text)" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}