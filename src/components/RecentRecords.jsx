// src/components/RecentRecords.jsx
export default function RecentRecords({ rows, columns, onView, onEdit, onDelete }) {
  if (!rows || rows.length === 0)
    return <p style={{ color:"#888899", fontSize:"0.88rem", marginTop:24 }}>No records yet.</p>;

  const showActions = onView || onEdit || onDelete;

  return (
    <div>
      <p className="records-label">Recent Records ({rows.length} total)</p>
      <div className="records-wrap">
        <table className="records-table">
          <thead>
            <tr>
              {columns.map((c) => <th key={c}>{c}</th>)}
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.slice().reverse().map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c}>{row[c.toLowerCase().replace(/ /g,"_")] ?? "—"}</td>
                ))}
                {showActions && (
                  <td>
                    {onView   && <button className="btn-view"   onClick={() => onView(row)}>👁 View</button>}
                    {onEdit   && <button className="btn-edit"   onClick={() => onEdit(row)}>✏️ Edit</button>}
                    {onDelete && <button className="btn-delete" onClick={() => onDelete(row)}>🗑️ Delete</button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}