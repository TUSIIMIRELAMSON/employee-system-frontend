// src/components/RecentRecords.jsx
export default function RecentRecords({ rows, columns }) {
  if (!rows || rows.length === 0)
    return <p style={{ color:"#888899", fontSize:"0.88rem", marginTop:24 }}>No records yet.</p>;

  return (
    <div>
      <p className="records-label">Recent Records</p>
      <div className="records-wrap">
        <table className="records-table">
          <thead>
            <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice().reverse().slice(0, 10).map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c}>{row[c.toLowerCase().replace(/ /g,"_")] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
