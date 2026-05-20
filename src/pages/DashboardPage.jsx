// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import DataForm       from "../components/DataForm";
import RecentRecords  from "../components/RecentRecords";
import ReportsPage    from "./ReportsPage";
import {
  addEmployee,     getEmployees,
  addDepartment,   getDepartments,
  addDeptManager,  getDeptManager,
  addDeptEmployee, getDeptEmployees,
  addSalary,       getSalaries,
} from "../api/api";

const TABS = [
  { id:"reports",        label:"📊 Reports",        icon:"📊" },
  { id:"employees",      label:"👤 Employees",       icon:"👤" },
  { id:"departments",    label:"🏢 Departments",     icon:"🏢" },
  { id:"dept_manager",   label:"🧑‍💼 Dept Manager",  icon:"🧑‍💼" },
  { id:"dept_employees", label:"👥 Dept Employees",  icon:"👥" },
  { id:"salaries",       label:"💰 Salaries",        icon:"💰" },
];

export default function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("reports");
  const [records, setRecords]     = useState({});

  // Fetch all table data on mount
  const fetchAll = useCallback(async () => {
    const [emp, dep, dm, de, sal] = await Promise.allSettled([
      getEmployees(), getDepartments(), getDeptManager(),
      getDeptEmployees(), getSalaries(),
    ]);
    setRecords({
      employees:      emp.status  === "fulfilled" ? emp.value  : [],
      departments:    dep.status  === "fulfilled" ? dep.value  : [],
      dept_manager:   dm.status   === "fulfilled" ? dm.value   : [],
      dept_employees: de.status   === "fulfilled" ? de.value   : [],
      salaries:       sal.status  === "fulfilled" ? sal.value  : [],
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div style={S.shell}>

      {/* ── Top Bar ── */}
      <nav style={S.topbar}>
        <div style={S.tbLeft}>
          <span style={S.tbLogo}>◆</span>
          <span style={S.tbTitle}>Employee DB</span>
        </div>
        <div style={S.tbRight}>
          <span style={S.tbUser}>{user.name} · {user.email}</span>
          <button style={S.signout} onClick={onLogout}>Sign Out</button>
        </div>
      </nav>

      <div style={S.body}>

        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <p style={S.sideLabel}>Navigation</p>
          {TABS.map((t) => (
            <button
              key={t.id}
              style={{ ...S.tabBtn, ...(activeTab === t.id ? S.tabActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span> {t.label.split(" ").slice(1).join(" ")}
            </button>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={S.main}>

          {activeTab === "reports" && <ReportsPage />}

          {activeTab === "employees" && (
            <Panel title="employees_table" sub="Add a new employee — saved directly to the database">
              <DataForm
                fields={[
                  { key:"emp_no",     label:"emp_no",     pk:true,  type:"number", placeholder:"e.g. 10001" },
                  { key:"birth_date", label:"birth_date",           type:"date" },
                  { key:"first_name", label:"first_name",           type:"text",   placeholder:"John" },
                  { key:"last_name",  label:"last_name",            type:"text",   placeholder:"Smith" },
                  { key:"gender",     label:"gender",               type:"select",
                    options:[{ value:"M", label:"M — Male" },{ value:"F", label:"F — Female" }] },
                  { key:"hire_date",  label:"hire_date",            type:"date" },
                ]}
                onSubmit={addEmployee}
                onSuccess={fetchAll}
              />
              <RecentRecords
                rows={records.employees}
                columns={["emp_no","first_name","last_name","gender","birth_date","hire_date"]}
              />
            </Panel>
          )}

          {activeTab === "departments" && (
            <Panel title="departments" sub="Add a new department">
              <DataForm
                fields={[
                  { key:"dept_no",   label:"dept_no",   type:"text", placeholder:"e.g. d001" },
                  { key:"dept_name", label:"dept_name", type:"text", placeholder:"e.g. Engineering" },
                ]}
                onSubmit={addDepartment}
                onSuccess={fetchAll}
              />
              <RecentRecords
                rows={records.departments}
                columns={["dept_no","dept_name"]}
              />
            </Panel>
          )}

          {activeTab === "dept_manager" && (
            <Panel title="dept_manager" sub="Assign a manager to a department">
              <DataForm
                fields={[
                  { key:"emp_no",    label:"emp_no",    type:"number", placeholder:"e.g. 10001" },
                  { key:"dept_no",   label:"dept_no",   type:"text",   placeholder:"e.g. d001" },
                  { key:"from_date", label:"from_date", type:"date" },
                  { key:"to_date",   label:"to_date",   type:"date" },
                ]}
                onSubmit={addDeptManager}
                onSuccess={fetchAll}
              />
              <RecentRecords
                rows={records.dept_manager}
                columns={["emp_no","dept_no","from_date","to_date"]}
              />
            </Panel>
          )}

          {activeTab === "dept_employees" && (
            <Panel title="dept_employees" sub="Assign an employee to a department">
              <DataForm
                fields={[
                  { key:"emp_no",    label:"emp_no",    type:"number", placeholder:"e.g. 10001" },
                  { key:"dept_no",   label:"dept_no",   type:"text",   placeholder:"e.g. d001" },
                  { key:"from_date", label:"from_date", type:"date" },
                  { key:"to_date",   label:"to_date",   type:"date" },
                ]}
                onSubmit={addDeptEmployee}
                onSuccess={fetchAll}
              />
              <RecentRecords
                rows={records.dept_employees}
                columns={["emp_no","dept_no","from_date","to_date"]}
              />
            </Panel>
          )}

          {activeTab === "salaries" && (
            <Panel title="salaries" sub="Add a salary record for an employee">
              <DataForm
                fields={[
                  { key:"emp_no",    label:"emp_no",    type:"number", placeholder:"e.g. 10001" },
                  { key:"salary",    label:"salary",    type:"number", placeholder:"e.g. 75000" },
                  { key:"from_date", label:"from_date", type:"date" },
                  { key:"to_date",   label:"to_date",   type:"date" },
                ]}
                onSubmit={addSalary}
                onSuccess={fetchAll}
              />
              <RecentRecords
                rows={records.salaries}
                columns={["emp_no","salary","from_date","to_date"]}
              />
            </Panel>
          )}

        </main>
      </div>
    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.75rem", fontWeight:400, color:"#f0f0f0", marginBottom:4 }}>{title}</h2>
        <p  style={{ color:"#888899", fontSize:"0.9rem" }}>{sub}</p>
      </div>
      {children}
    </div>
  );
}

const S = {
  shell:    { minHeight:"100vh", background:"#0f0f11", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" },
  topbar:   { height:58, background:"#1a1a1f", borderBottom:"1px solid #2e2e38", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:100 },
  tbLeft:   { display:"flex", alignItems:"center", gap:10 },
  tbLogo:   { color:"#c8f261", fontSize:18 },
  tbTitle:  { fontFamily:"'DM Serif Display',serif", fontSize:"1.1rem", color:"#f0f0f0" },
  tbRight:  { display:"flex", alignItems:"center", gap:16 },
  tbUser:   { fontSize:"0.86rem", color:"#888899" },
  signout:  { background:"transparent", border:"1px solid #2e2e38", color:"#888899", borderRadius:7, padding:"7px 14px", fontFamily:"inherit", fontSize:"0.83rem", cursor:"pointer" },
  body:     { display:"flex", flex:1 },
  sidebar:  { width:220, minWidth:220, background:"#1a1a1f", borderRight:"1px solid #2e2e38", padding:"24px 14px" },
  sideLabel:{ fontSize:"0.7rem", fontWeight:700, color:"#888899", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, paddingLeft:10 },
  tabBtn:   { display:"flex", alignItems:"center", gap:10, width:"100%", background:"transparent", border:"none", borderRadius:9, padding:"11px 14px", color:"#888899", fontFamily:"inherit", fontSize:"0.91rem", fontWeight:500, cursor:"pointer", textAlign:"left", marginBottom:3 },
  tabActive: { background:"rgba(200,242,97,0.12)", color:"#c8f261" },
  main:     { flex:1, padding:"36px 44px", overflowY:"auto" },
};
