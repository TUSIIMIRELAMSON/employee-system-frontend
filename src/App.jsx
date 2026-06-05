// src/App.jsx
import { useState } from "react";
import CompanyAuth   from "./pages/CompanyAuth";
import AuthPage      from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

// Load Google Fonts
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap";
link.rel  = "stylesheet";
document.head.appendChild(link);

// Handle public onboarding route
if (window.location.pathname.startsWith("/onboarding/")) {
  const OnboardingForm = require("./pages/OnboardingForm").default;
  return <OnboardingForm />;
}

export default function App() {
  const storedCompany = localStorage.getItem("emp_company");
  const storedUser    = localStorage.getItem("emp_user");
  const storedToken   = localStorage.getItem("emp_token");

  const [company, setCompany] = useState(storedCompany ? JSON.parse(storedCompany) : null);
  const [user,    setUser]    = useState(storedUser && storedToken ? JSON.parse(storedUser) : null);

  function handleCompanyVerified(c) {
    localStorage.setItem("emp_company", JSON.stringify(c));
    setCompany(c);
  }

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("emp_token");
    localStorage.removeItem("emp_user");
    setUser(null);
  }

  // Step 1: Company must sign in first
  if (!company) return <CompanyAuth onCompanyVerified={handleCompanyVerified} />;

  // Step 2: User must sign in
  if (!user) return <AuthPage onLogin={handleLogin} company={company} />;

  // Step 3: Dashboard
  return <DashboardPage user={user} onLogout={handleLogout} company={company} />;
}
