// src/components/RecentRecords.jsx

export default function RecentRecords({ rows, columns }) {
  if (!rows || rows.length === 0)
    return <p style={{ color:"#888899", fontSize:"0.88rem", marginTop:24 }}>No records yet.</p>;

  return (
    <div style={S.wrap}>
      <p style={S.label}>Recent Records</p>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {columns.map((c) => <th key={c} style={S.th}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.slice().reverse().slice(0, 10).map((row, i) => (
              <tr key={i} style={i % 2 === 0 ? S.rowEven : S.rowOdd}>
                {columns.map((c) => (
                  <td key={c} style={S.td}>
                    {row[c.toLowerCase().replace(/ /g,"_")] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const S = {
  wrap:      { marginTop: 32 },
  label:     { fontSize:"0.75rem", fontWeight:700, color:"#888899", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 },
  tableWrap: { overflowX:"auto", borderRadius:10, border:"1px solid #2e2e38" },
  table:     { width:"100%", borderCollapse:"collapse", fontFamily:"inherit", fontSize:"0.88rem" },
  th:        { background:"#1a1a1f", color:"#888899", padding:"10px 14px", textAlign:"left", fontWeight:600, fontSize:"0.78rem", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #2e2e38" },
  rowEven:   { background:"#111114" },
  rowOdd:    { background:"#0f0f11" },
  td:        { padding:"10px 14px", color:"#d0d0d0", borderBottom:"1px solid #1a1a1f" },
};
