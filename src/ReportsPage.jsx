// src/pages/ReportsPage.jsx
import { useEffect, useState } from "react";
import { getSummary } from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#c8f261","#4ecdc4","#ff6b6b","#ffd93d","#6c63ff","#a8d44a"];
const tooltipStyle = {
  background:"#1a1a1f", border:"1px solid #2e2e38",
  borderRadius:8, color:"#f0f0f0", fontFamily:"inherit",
};

export default function ReportsPage() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummary().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{color:"#ff6b6b",padding:32}}>{error}</p>;
  if (!data)  return <p style={{color:"#888899",padding:32}}>Loading reports…</p>;

  const maleCount   = data.gender_split.find(g=>g.gender==="M")?.count || 0;
  const femaleCount = data.gender_split.find(g=>g.gender==="F")?.count || 0;

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-icon">👤</span>
          <div className="kpi-value">{data.total_employees}</div>
          <div className="kpi-label">Employees</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">🏢</span>
          <div className="kpi-value">{data.total_departments}</div>
          <div className="kpi-label">Departments</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">💰</span>
          <div className="kpi-value">${Number(data.avg_salary).toLocaleString()}</div>
          <div className="kpi-label">Avg Salary</div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">⚧</span>
          <div className="kpi-value">{maleCount}/{femaleCount}</div>
          <div className="kpi-label">M / F</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        <div className="chart-card">
          <p className="chart-title">Employees per Department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.employees_per_dept} margin={{top:10,right:10,left:-10,bottom:40}}>
              <XAxis dataKey="dept_name" tick={{fill:"#888899",fontSize:11}} angle={-30} textAnchor="end"/>
              <YAxis tick={{fill:"#888899",fontSize:11}} allowDecimals={false}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Bar dataKey="count" fill="#c8f261" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <p className="chart-title">Gender Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.gender_split} dataKey="count" nameKey="gender"
                cx="50%" cy="50%" outerRadius={80}
                label={({gender,percent})=>`${gender} ${(percent*100).toFixed(0)}%`}
              >
                {data.gender_split.map((_,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        <div className="chart-card">
          <p className="chart-title">Average Salary by Department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.salary_by_dept} margin={{top:10,right:10,left:10,bottom:40}}>
              <XAxis dataKey="dept_name" tick={{fill:"#888899",fontSize:11}} angle={-30} textAnchor="end"/>
              <YAxis tick={{fill:"#888899",fontSize:11}} tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={tooltipStyle} formatter={(v)=>`$${Number(v).toLocaleString()}`}/>
              <Bar dataKey="avg_salary" fill="#4ecdc4" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <p className="chart-title">Hires by Year</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.hires_by_year} margin={{top:10,right:10,left:-10,bottom:10}}>
              <CartesianGrid stroke="#2e2e38" strokeDasharray="3 3"/>
              <XAxis dataKey="year" tick={{fill:"#888899",fontSize:11}}/>
              <YAxis tick={{fill:"#888899",fontSize:11}} allowDecimals={false}/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Line type="monotone" dataKey="count" stroke="#c8f261" strokeWidth={2} dot={{fill:"#c8f261"}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
