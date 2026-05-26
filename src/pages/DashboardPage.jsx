// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
import DataForm       from "../components/DataForm";
import RecentRecords  from "../components/RecentRecords";
import ReportsPage    from "./ReportsPage";
import {
  addEmployee,     getEmployees,    deleteEmployee,    updateEmployee,
  addDepartment,   getDepartments,  deleteDepartment,  updateDepartment,
  addDeptManager,  getDeptManager,  deleteDeptManager,
  addDeptEmployee, getDeptEmployees,deleteDeptEmployee,
  addSalary,       getSalaries,     deleteSalary,      updateSalary,
} from "../api/api";

const TABS = [
  { id:"reports",        icon:"📊", label:"Reports"        },
  { id:"employees",      icon:"👤", label:"Employees"       },
  { id:"departments",    icon:"🏢", label:"Departments"     },
  { id:"dept_manager",   icon:"🧑‍💼", label:"Dept Manager"  },
  { id:"dept_employees", icon:"👥", label:"Dept Employees"  },
  { id:"salaries",       icon:"💰", label:"Salaries"        },
];

export default function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("reports");
  const [records, setRecords]     = useState({});

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editForm,  setEditForm]  = useState({});

  const [editModal, setEditModal]   = useState(null); // { table, row }
  const [editForm,  setEditForm]    = useState({});

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

  function selectTab(id) {
    setActiveTab(id);
    setSidebarOpen(false); // close sidebar on mobile after selection
  }

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

  return (
    <div className="shell">

      {/* ── Top Bar ── */}
      <nav className="topbar">
        <div className="topbar-left">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="topbar-logo">◆</span>
          <span className="topbar-title">Employee DB</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-user">{user.name}</span>
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
            </button>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
          {activeTab === "reports" && <ReportsPage />}

          {activeTab === "employees" && (
            <Panel title="employees_table" sub="Add a new employee — saved directly to the database">
              <DataForm
                fields={[
                  { key:"emp_no",     label:"emp_no",     pk:true, type:"number", placeholder:"e.g. 10001" },
                  { key:"birth_date", label:"birth_date",          type:"date" },
                  { key:"first_name", label:"first_name",          type:"text",   placeholder:"John" },
                  { key:"last_name",  label:"last_name",           type:"text",   placeholder:"Smith" },
                  { key:"gender",     label:"gender",              type:"select",
                    options:[{value:"M",label:"M — Male"},{value:"F",label:"F — Female"}] },
                  { key:"hire_date",  label:"hire_date",           type:"date" },
                ]}
                onSubmit={addEmployee}
                onSuccess={fetchAll}
              />
              
              <RecentRecords
  rows={records.employees}
  columns={["emp_no","first_name","last_name","gender","birth_date","hire_date"]}
  onEdit={(row) => openEdit("employees", row)}
  onDelete={(row) => handleDelete("employees", row)}
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
  onEdit={(row) => openEdit("departments", row)}
  onDelete={(row) => handleDelete("departments", row)}
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
  onDelete={(row) => handleDelete("dept_manager", row)}
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
  onDelete={(row) => handleDelete("dept_employees", row)}
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
  onEdit={(row) => openEdit("salaries", row)}
  onDelete={(row) => handleDelete("salaries", row)}
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
      <h2 className="panel-title">{title}</h2>
      <p  className="panel-sub">{sub}</p>
      {children}

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
