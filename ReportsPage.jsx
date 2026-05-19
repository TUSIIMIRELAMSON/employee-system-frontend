// src/pages/ReportsPage.jsx
import { useEffect, useState } from "react";
import { getSummary } from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#c8f261","#4ecdc4","#ff6b6b","#ffd93d","#6c63ff","#a8d44a"];

export default function ReportsPage() {
  const [data, setData]     = useState(null);
  const [error, setError]   = useState("");

  useEffect(() => {
    getSummary()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color:"#ff6b6b", padding:32 }}>{error}</p>;
  if (!data)  return <p style={{ color:"#888899", padding:32 }}>Loading reports…</p>;

  return (
    <div style={S.page}>

      {/* ── KPI Cards ── */}
      <div style={S.kpiRow}>
        <KpiCard label="Total Employees"  value={data.total_employees} icon="👤" />
        <KpiCard label="Total Departments" value={data.total_departments} icon="🏢" />
        <KpiCard label="Avg Salary"        value={`$${Number(data.avg_salary).toLocaleString()}`} icon="💰" />
        <KpiCard label="Gender (M/F)"
          value={`${data.gender_split.find(g=>g.gender==="M")?.count||0} / ${data.gender_split.find(g=>g.gender==="F")?.count||0}`}
          icon="⚧"
        />
      </div>

      <div style={S.chartsRow}>

        {/* Employees per Department - Bar */}
        <ChartCard title="Employees per Department">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.employees_per_dept} margin={{ top:10, right:10, left:-10, bottom:40 }}>
              <XAxis dataKey="dept_name" tick={{ fill:"#888899", fontSize:11 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill:"#888899", fontSize:11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#c8f261" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gender split - Pie */}
        <ChartCard title="Gender Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.gender_split} dataKey="count" nameKey="gender"
                cx="50%" cy="50%" outerRadius={80} label={({ gender, percent }) =>
                  `${gender} ${(percent*100).toFixed(0)}%`
                }
              >
                {data.gender_split.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      <div style={S.chartsRow}>

        {/* Avg Salary by Department - Bar */}
        <ChartCard title="Average Salary by Department">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.salary_by_dept} margin={{ top:10, right:10, left:10, bottom:40 }}>
              <XAxis dataKey="dept_name" tick={{ fill:"#888899", fontSize:11 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill:"#888899", fontSize:11 }} tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v)=>`$${Number(v).toLocaleString()}`} />
              <Bar dataKey="avg_salary" fill="#4ecdc4" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hires by Year - Line */}
        <ChartCard title="Hires by Year">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.hires_by_year} margin={{ top:10, right:10, left:-10, bottom:10 }}>
              <CartesianGrid stroke="#2e2e38" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill:"#888899", fontSize:11 }} />
              <YAxis tick={{ fill:"#888899", fontSize:11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#c8f261" strokeWidth={2} dot={{ fill:"#c8f261" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

function KpiCard({ label, value, icon }) {
  return (
    <div style={S.kpi}>
      <span style={S.kpiIcon}>{icon}</span>
      <p  style={S.kpiValue}>{value}</p>
      <p  style={S.kpiLabel}>{label}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={S.chartCard}>
      <p style={S.chartTitle}>{title}</p>
      {children}
    </div>
  );
}

const tooltipStyle = {
  background: "#1a1a1f",
  border: "1px solid #2e2e38",
  borderRadius: 8,
  color: "#f0f0f0",
  fontFamily: "inherit",
};

const S = {
  page:       { padding:"32px 0" },
  kpiRow:     { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:28 },
  kpi:        { background:"#1a1a1f", border:"1px solid #2e2e38", borderRadius:12, padding:"22px 20px", textAlign:"center" },
  kpiIcon:    { fontSize:26 },
  kpiValue:   { fontFamily:"'DM Serif Display',serif", fontSize:"1.8rem", color:"#c8f261", margin:"8px 0 4px" },
  kpiLabel:   { fontSize:"0.8rem", color:"#888899", textTransform:"uppercase", letterSpacing:"0.06em", margin:0 },
  chartsRow:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 },
  chartCard:  { background:"#1a1a1f", border:"1px solid #2e2e38", borderRadius:12, padding:"22px 20px" },
  chartTitle: { fontSize:"0.8rem", fontWeight:700, color:"#888899", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 },
};
