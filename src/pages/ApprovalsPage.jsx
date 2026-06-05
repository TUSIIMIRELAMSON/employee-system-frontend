// src/pages/ApprovalsPage.jsx
import { useState, useEffect } from "react";
import { getApprovals, approveManager, rejectManager } from "../api/api";

export default function ApprovalsPage({ isAdmin }) {
  const [approvals, setApprovals] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState("");

  useEffect(() => { fetchApprovals(); }, []);

  async function fetchApprovals() {
    try {
      const data = await getApprovals();
      setApprovals(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await approveManager(id);
      setMsg("✅ Manager approved successfully!");
      fetchApprovals();
    } catch (e) { setMsg("❌ " + e.message); }
  }

  async function handleReject(id) {
    if (!window.confirm("Are you sure you want to reject this manager request?")) return;
    try {
      await rejectManager(id);
      setMsg("Manager request rejected.");
      fetchApprovals();
    } catch (e) { setMsg("❌ " + e.message); }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }

  const pending  = approvals.filter(a => a.status === "pending");
  const reviewed = approvals.filter(a => a.status !== "pending");

  if (loading) return <p style={{ color: "#888899" }}>Loading approvals…</p>;

  return (
    <div>
      <h2 className="panel-title">Manager Approvals</h2>
      <p className="panel-sub">Review and approve manager role requests</p>

      {msg && <p style={{ color: "#c8f261", marginBottom: 16, fontSize: "0.88rem" }}>{msg}</p>}

      {/* Pending */}
      <div style={{ marginBottom: 32 }}>
        <p className="records-label">Pending Requests ({pending.length})</p>
        {pending.length === 0 ? (
          <p style={{ color: "#888899", fontSize: "0.88rem" }}>No pending requests.</p>
        ) : (
          pending.map(a => (
            <div key={a.id} className="approval-card">
              <div className="approval-info">
                <div className="approval-name">👤 {a.employee_name}</div>
                <div className="approval-meta">
                  {a.email && <span>{a.email} · </span>}
                  {a.department && <span>Dept: {a.department} · </span>}
                  <span>Emp No: {a.emp_no} · </span>
                  <span>Requested: {formatDate(a.requested_at)}</span>
                </div>
              </div>
              {isAdmin ? (
                <div className="approval-actions">
                  <button className="btn-approve" onClick={() => handleApprove(a.id)}>
                    ✅ Approve
                  </button>
                  <button className="btn-reject" onClick={() => handleReject(a.id)}>
                    ❌ Reject
                  </button>
                </div>
              ) : (
                <span className="status-pending">⏳ Pending</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <p className="records-label">Reviewed ({reviewed.length})</p>
          {reviewed.map(a => (
            <div key={a.id} className="approval-card">
              <div className="approval-info">
                <div className="approval-name">👤 {a.employee_name}</div>
                <div className="approval-meta">
                  {a.email && <span>{a.email} · </span>}
                  {a.department && <span>Dept: {a.department} · </span>}
                  <span>Reviewed by: {a.reviewed_by || "—"} on {formatDate(a.reviewed_at)}</span>
                </div>
              </div>
              <span className={`status-${a.status}`}>
                {a.status === "approved" ? "✅ Approved" : "❌ Rejected"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}