// src/api/api.js
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("emp_token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function request(path, method = "GET", body = null) {
  const opts = { method, headers: authHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data;
}

// ── Company ───────────────────────────────────
export const verifyCompany   = (d) =>
  fetch(`${BASE}/api/company/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  }).then(async (r) => {
    const j = await r.json();
    if (!r.ok) throw new Error(j.message);
    return j.data;
  });

// ── Auth ──────────────────────────────────────
export const signup = (data) =>
  fetch(`${BASE}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (r) => {
    const j = await r.json();
    if (!r.ok) throw new Error(j.message);
    return j;
  });

export const signin = (data) =>
  fetch(`${BASE}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (r) => {
    const j = await r.json();
    if (!r.ok) throw new Error(j.message);
    return j.data;
  });

// ── Tables ───────────────────────────────────
export const addEmployee     = (d) => request("/api/employees",     "POST", d);
export const getEmployees    = ()  => request("/api/employees");

export const addDepartment   = (d) => request("/api/departments",   "POST", d);
export const getDepartments  = ()  => request("/api/departments");

export const addDeptManager  = (d) => request("/api/dept_manager",  "POST", d);
export const getDeptManager  = ()  => request("/api/dept_manager");

export const addDeptEmployee = (d) => request("/api/dept_employees","POST", d);
export const getDeptEmployees= ()  => request("/api/dept_employees");

export const addSalary       = (d) => request("/api/salaries",      "POST", d);
export const getSalaries     = ()  => request("/api/salaries");

// ── Delete ───────────────────────────────────
export const deleteEmployee     = (id) => request(`/api/employees/${id}`,     "DELETE");
export const deleteDepartment   = (id) => request(`/api/departments/${id}`,   "DELETE");
export const deleteDeptManager  = (emp, dept) => request(`/api/dept_manager/${emp}/${dept}`,  "DELETE");
export const deleteDeptEmployee = (emp, dept) => request(`/api/dept_employees/${emp}/${dept}`,"DELETE");
export const deleteSalary       = (emp, from) => request(`/api/salaries/${emp}/${from}`,      "DELETE");

// ── Update ───────────────────────────────────
export const updateEmployee     = (id, d) => request(`/api/employees/${id}`,     "PUT", d);
export const updateDepartment   = (id, d) => request(`/api/departments/${id}`,   "PUT", d);
export const updateSalary       = (emp, from, d) => request(`/api/salaries/${emp}/${from}`, "PUT", d);

// ── Reports ──────────────────────────────────
export const getSummary = () => request("/api/reports/summary");

// ── Chat ─────────────────────────────────────
export const getMessages = ()  => request("/api/messages");
export const sendMessage = (d) => request("/api/messages", "POST", d);
