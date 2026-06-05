// src/pages/DashboardPage.jsx

import WizardPage     from "./WizardPage";
import ApprovalsPage  from "./ApprovalsPage";
import { getPendingCount } from "../api/api";

import { useState, useEffect, useCallback } from "react";
import DataForm       from "../components/DataForm";
import RecentRecords  from "../components/RecentRecords";
import ReportsPage    from "./ReportsPage";
import Pagination from "../components/Pagination";
import ChatPage from "./ChatPage";

import {
  addEmployee,     getEmployees,    deleteEmployee,    updateEmployee,
  addDepartment,   getDepartments,  deleteDepartment,  updateDepartment,
  addDeptManager,  getDeptManager,  deleteDeptManager,
  addDeptEmployee, getDeptEmployees,deleteDeptEmployee,
  addSalary,       getSalaries,     deleteSalary,      updateSalary,
} from "../api/api";

const TABS = [
  { id:"reports",        icon:"📊", label:"Reports"        },
  { id:"wizard",         icon:"🧙", label:"Add Employee"    },
  { id:"employees",      icon:"👤", label:"Employees"       },
  { id:"departments",    icon:"🏢", label:"Departments"     },
  { id:"dept_manager",   icon:"🧑‍💼", label:"Dept Manager"  },
  { id:"dept_employees", icon:"👥", label:"Dept Employees"  },
  { id:"salaries",       icon:"💰", label:"Salaries"        },
  { id:"approvals",      icon:"✅", label:"Approvals"       },
  { id:"chat", icon:"💬", label:"Chat" },
];

export default function DashboardPage({ user, onLogout, company }) {
  const [activeTab, setActiveTab]     = useState("reports");
  const [records, setRecords]         = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editModal, setEditModal]     = useState(null);
  const [editForm,  setEditForm]      = useState({});
  const [search, setSearch]           = useState("");
  const [deptFilter, setDeptFilter]   = useState("");
  const [salaryMin, setSalaryMin]     = useState("");
  const [salaryMax, setSalaryMax]     = useState("");
  const [profileEmp, setProfileEmp] = useState(null);
  const [empPage,  setEmpPage]  = useState(1);
  const [deptPage, setDeptPage] = useState(1);
  const [dmPage,   setDmPage]   = useState(1);
  const [dePage,   setDePage]   = useState(1);
  const [salPage,  setSalPage]  = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const isAdmin = user?.role === "admin";
  const PER_PAGE = 5;

  const fetchAll = useCallback(async () => {
    const [emp, dep, dm, de, sal] = await Promise.allSettled([
      getEmployees(), getDepartments(), getDeptManager(),
      getDeptEmployees(), getSalaries(),
    ]);
    setRecords({
      employees:      emp.status === "fulfilled" ? emp.value : [],
      departments:    dep.status === "fulfilled" ? dep.value : [],
      dept_manager:   dm.status  === "fulfilled" ? dm.value  : [],
      dept_employees: de.status  === "fulfilled" ? de.value  : [],
      salaries:       sal.status === "fulfilled" ? sal.value : [],
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => {
    getPendingCount().then(d => setPendingCount(d?.count || 0)).catch(() => {});
  }, []);

  function selectTab(id) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  // ── Filtered data ────────────────────────────
  const filteredEmployees = (records.employees || []).filter(e => {
    const matchName = `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "" || (records.dept_employees || []).some(
      de => de.emp_no === e.emp_no && de.dept_no === deptFilter
    );
    return matchName && matchDept;
  });

  const filteredSalaries = (records.salaries || []).filter(s => {
    const matchMin = salaryMin === "" || s.salary >= Number(salaryMin);
    const matchMax = salaryMax === "" || s.salary <= Number(salaryMax);
    return matchMin && matchMax;
  });
  // ── Paginated data ───────────────────────────
   const pagedEmployees = filteredEmployees.slice((empPage-1)*PER_PAGE, empPage*PER_PAGE);
   const pagedDepts     = (records.departments||[]).slice((deptPage-1)*PER_PAGE, deptPage*PER_PAGE);
   const pagedDM        = (records.dept_manager||[]).slice((dmPage-1)*PER_PAGE, dmPage*PER_PAGE);
   const pagedDE        = (records.dept_employees||[]).slice((dePage-1)*PER_PAGE, dePage*PER_PAGE);
   const pagedSalaries  = filteredSalaries.slice((salPage-1)*PER_PAGE, salPage*PER_PAGE);

  // ── Delete handlers ──────────────────────────
  async function handleDelete(table, row) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      if (table === "employees")      await deleteEmployee(row.emp_no);
      if (table === "departments")    await deleteDepartment(row.dept_no);
      if (table === "dept_manager")   await deleteDeptManager(row.emp_no, row.dept_no);
      if (table === "dept_employees") await deleteDeptEmployee(row.emp_no, row.dept_no);
      if (table === "salaries")       await deleteSalary(row.emp_no, row.from_date);
      fetchAll();
    } catch (e) { alert("Delete failed: " + e.message); }
  }

  // ── Edit handlers ────────────────────────────
  function openEdit(table, row) {
    setEditModal({ table, row });
    setEditForm({ ...row });
  }

  function closeEdit() {
    setEditModal(null);
    setEditForm({});
  }

  async function handleUpdate() {
    try {
      const { table, row } = editModal;
      if (table === "employees")   await updateEmployee(row.emp_no, editForm);
      if (table === "departments") await updateDepartment(row.dept_no, editForm);
      if (table === "salaries")    await updateSalary(row.emp_no, row.from_date, editForm);
      closeEdit();
      fetchAll();
    } catch (e) { alert("Update failed: " + e.message); }
  }

  // ── Export to Excel ──────────────────────────
function exportToExcel(data, filename) {
  import("xlsx").then(XLSX => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  });
}

   // ── View Profile ─────────────────────────────
function openProfile(emp) {
  setProfileEmp(emp);
}

function closeProfile() {
  setProfileEmp(null);
}

function getEmpDept(emp_no) {
  const de = (records.dept_employees || []).find(d => d.emp_no === emp_no);
  if (!de) return "—";
  const dept = (records.departments || []).find(d => d.dept_no === de.dept_no);
  return dept ? dept.dept_name : de.dept_no;
}

function getEmpSalary(emp_no) {
  const sal = (records.salaries || []).find(s => s.emp_no === emp_no);
  return sal ? `$${Number(sal.salary).toLocaleString()}` : "—";
}

function isManager(emp_no) {
  return (records.dept_manager || []).some(m => m.emp_no === emp_no);
}

// ── Theme toggle ─────────────────────────────
function toggleTheme() {
  const newMode = !darkMode;
  setDarkMode(newMode);
  document.body.classList.toggle("light", !newMode);
}

  return (
    <div className="shell">

      {/* ── Top Bar ── */}
      <nav className="topbar">
        <div className="topbar-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="topbar-logo">◆</span>
          <span className="topbar-title">{company?.company_name || "Employee DB"}</span>
        </div>
        <div className="topbar-right">
        <span className="topbar-user">
         {user.name} 
         <span style={{
         marginLeft:8, fontSize:"0.7rem", padding:"2px 8px",
         borderRadius:20, background: user.role === "admin" ? "rgba(200,242,97,0.15)" : "rgba(78,205,196,0.15)",
         color: user.role === "admin" ? "var(--accent)" : "#4ecdc4",
         fontWeight:600, textTransform:"uppercase"
         }}>
         {user.role || "user"}
        </span>
       </span>
         <button className="btn-theme" onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
         </button>
        <button className="btn-signout" onClick={onLogout}>Sign Out</button>
      </div>
      </nav>

      <div className="db-body">

        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <p className="sidebar-label">Navigation</p>

         {TABS.map((t) => (
           <button
             key={t.id}
             className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
             onClick={() => selectTab(t.id)}
           >
      
            <span>{t.icon}</span> {t.label}
            {t.id === "approvals" && pendingCount > 0 && (
             <span className="notif-badge">{pendingCount}</span>
          )}
           </button>
       ))}

        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
          {activeTab === "reports" && <ReportsPage user={user} />}

          {activeTab === "wizard" && (
  <Panel title="Add New Employee" sub="Complete employee setup in one flow">
    <WizardPage
      departments={records.departments || []}
      onSuccess={(result) => {
        fetchAll();
        getPendingCount().then(d => setPendingCount(d?.count || 0)).catch(() => {});
        if (result?.is_manager) {
          alert("✅ Employee saved! Manager role is pending admin approval.");
        } else {
          alert("✅ Employee saved successfully!");
        }
        selectTab("employees");
      }}
      onClose={() => selectTab("employees")}
    />
  </Panel>
)}

{activeTab === "approvals" && (
  <ApprovalsPage
    isAdmin={isAdmin}
    onApprovalChange={() => {
      getPendingCount().then(d => setPendingCount(d?.count || 0)).catch(() => {});
    }}
  />
)}

          {activeTab === "employees" && (
            <Panel title="Employees_table" sub="Add a new employee — saved directly to the database">
              {isAdmin && (
              <DataForm
                fields={[
                  { key:"emp_no",     label:"emp_no",     pk:true, type:"number", placeholder:"e.g. 10001" },
                  { key:"birth_date", label:"birth_date",          type:"date" },
                  { key:"first_name", label:"first_name",          type:"text",   placeholder:"McLam" },
                  { key:"last_name",  label:"last_name",           type:"text",   placeholder:"Junior" },
                  { key:"gender",     label:"gender",              type:"select",
                    options:[{value:"M",label:"M — Male"},{value:"F",label:"F — Female"}] },
                  { key:"hire_date",  label:"hire_date",           type:"date" },
                ]}
                onSubmit={addEmployee}
                onSuccess={fetchAll}
              />
              )}
              <div className="search-bar">
                <input
                  className="search-input"
                  placeholder="🔍 Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="filter-select"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {(records.departments || []).map(d => (
                    <option key={d.dept_no} value={d.dept_no}>{d.dept_name}</option>
                  ))}
                </select>
              </div>
              <p className="search-count">{filteredEmployees.length} employee(s) found</p>

              <button className="btn-export" onClick={() => exportToExcel(filteredEmployees, "employees")}>
                 ⬇️ Download Excel
              </button>


             <RecentRecords
              rows={pagedEmployees}
              columns={["emp_no","first_name","last_name","gender","birth_date","hire_date"]}
              onView={(row) => openProfile(row)}
              onEdit={isAdmin ? (row) => openEdit("employees", row) : null}
              onDelete={isAdmin ? (row) => handleDelete("employees", row) : null}
             />
            <Pagination total={filteredEmployees.length} page={empPage} perPage={PER_PAGE} onChange={setEmpPage} />
            </Panel>
          )}

          {activeTab === "departments" && (
            <Panel title="Departments" sub="Add a new Department">
              <button className="btn-export" onClick={() => exportToExcel(records.departments || [], "departments")}>
                 ⬇️ Download Excel
              </button>
               {isAdmin && (
              <DataForm
                fields={[
                  { key:"dept_no",   label:"dept_no",   type:"text", placeholder:"e.g. d001" },
                  { key:"dept_name", label:"dept_name", type:"text", placeholder:"e.g. Engineering" },
                ]}
                onSubmit={addDepartment}
                onSuccess={fetchAll}
              />
               )}
             <RecentRecords
               rows={pagedDepts}
               columns={["dept_no","dept_name"]}
               onEdit={isAdmin ? (row) => openEdit("departments", row) : null}
               onDelete={isAdmin ? (row) => handleDelete("departments", row) : null}
             />
              <Pagination total={(records.departments||[]).length} page={deptPage} perPage={PER_PAGE} onChange={setDeptPage} />
            </Panel>
          )}

          {activeTab === "dept_manager" && (
            <Panel title="Department Managers" sub="Assign a manager to a department">
              <button className="btn-export" onClick={() => exportToExcel(records.dept_manager || [], "dept_manager")}>
                 ⬇️ Download Excel
              </button>

               {isAdmin && (
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
                )}
            <RecentRecords
              rows={pagedDM}
              columns={["emp_no","dept_no","from_date","to_date"]}
              onDelete={isAdmin ? (row) => handleDelete("dept_manager", row) : null}
            />
            <Pagination total={(records.dept_manager||[]).length} page={dmPage} perPage={PER_PAGE} onChange={setDmPage} />
            </Panel>
          )}

          {activeTab === "dept_employees" && (
            <Panel title="Department Employees" sub="Assign an employee to a department">
              <button className="btn-export" onClick={() => exportToExcel(records.dept_employees || [], "dept_employees")}>
                ⬇️ Download Excel
              </button>
            {isAdmin && (
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
            )}
              <RecentRecords
                rows={pagedDE}
                columns={["emp_no","dept_no","from_date","to_date"]}
                onDelete={isAdmin ? (row) => handleDelete("dept_employees", row) : null}
               />
              <Pagination total={(records.dept_employees||[]).length} page={dePage} perPage={PER_PAGE} onChange={setDePage} />
            </Panel>
          )}

          {activeTab === "salaries" && (
            <Panel title="Salaries" sub="Add a salary record for an employee">
               {isAdmin && (
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
                )}
              <div className="search-bar">
                <input
                  className="search-input"
                  placeholder="Min salary e.g. 50000"
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
                <input
                  className="search-input"
                  placeholder="Max salary e.g. 100000"
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
              <p className="search-count">{filteredSalaries.length} record(s) found</p>
              <button className="btn-export" onClick={() => exportToExcel(filteredSalaries, "salaries")}>
                 ⬇️ Download Excel
              </button>
              <RecentRecords
                rows={pagedSalaries}
                columns={["emp_no","salary","from_date","to_date"]}
                onEdit={isAdmin ? (row) => openEdit("salaries", row) : null}
                onDelete={isAdmin ? (row) => handleDelete("salaries", row) : null}
              />
              <Pagination total={filteredSalaries.length} page={salPage} perPage={PER_PAGE} onChange={setSalPage} />
            </Panel>

             )}

             {activeTab === "chat" && <ChatPage user={user} />}

        </main>
        {/* ── Profile Modal ── */}
{profileEmp && (
  <div className="profile-overlay" onClick={closeProfile}>
    <div className="profile-box" onClick={(e) => e.stopPropagation()}>
      <div className="profile-header">
        <div className="profile-avatar">
          {profileEmp.gender === "M" ? "👨" : "👩"}
        </div>
        <div>
          <div className="profile-name">{profileEmp.first_name} {profileEmp.last_name}</div>
          <div className="profile-emp-no">Employee #{profileEmp.emp_no}</div>
          {isManager(profileEmp.emp_no) && (
            <span className="profile-badge">Manager</span>
          )}
        </div>
      </div>

      <div className="profile-section">
        <p className="profile-section-title">Personal Info</p>
        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-item-label">Gender</div>
            <div className="profile-item-value">{profileEmp.gender === "M" ? "Male" : "Female"}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Date of Birth</div>
            <div className="profile-item-value">{profileEmp.birth_date}</div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <p className="profile-section-title">Employment Info</p>
        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-item-label">Hire Date</div>
            <div className="profile-item-value">{profileEmp.hire_date}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Department</div>
            <div className="profile-item-value">{getEmpDept(profileEmp.emp_no)}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Salary</div>
            <div className="profile-item-value">{getEmpSalary(profileEmp.emp_no)}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Role</div>
            <div className="profile-item-value">{isManager(profileEmp.emp_no) ? "Manager" : "Employee"}</div>
          </div>
        </div>
      </div>

      <button className="btn-cancel" onClick={closeProfile} style={{width:"100%",marginTop:8}}>
        Close
      </button>
    </div>
  </div>
)}

      </div>

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Edit Record</h3>
            {Object.keys(editForm).map((key) => (
              <div className="form-group" key={key}>
                <label className="form-label">{key}</label>
                <input
                  className="form-input"
                  value={editForm[key] ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn-update" onClick={handleUpdate}>💾 Update</button>
              <button className="btn-cancel" onClick={closeEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div>
      <h2 className="panel-title">{title}</h2>
      <p  className="panel-sub">{sub}</p>
      {children}
    </div>
  );
}

