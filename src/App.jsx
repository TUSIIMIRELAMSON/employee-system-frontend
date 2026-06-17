// src/App.jsx
import { useState } from "react";
import LandingPage    from "./pages/LandingPage";
import CompanyAuth    from "./pages/CompanyAuth";
import AuthPage       from "./pages/AuthPage";
import DashboardPage  from "./pages/DashboardPage";
import OnboardingForm from "./pages/OnboardingForm";

// Load Google Fonts
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap";
link.rel  = "stylesheet";
document.head.appendChild(link);

export default function App() {
  const storedCompany = localStorage.getItem("emp_company");
  const storedUser    = localStorage.getItem("emp_user");
  const storedToken   = localStorage.getItem("emp_token");

  const [showLanding, setShowLanding] = useState(!storedCompany);
  const [company, setCompany] = useState(storedCompany ? JSON.parse(storedCompany) : null);
  const [user,    setUser]    = useState(storedUser && storedToken ? JSON.parse(storedUser) : null);

  // Handle public onboarding route — no login needed
  if (window.location.pathname.startsWith("/onboarding/")) {
    return <OnboardingForm />;
  }

  function handleCompanyVerified(c) {
    localStorage.setItem("emp_company", JSON.stringify(c));
    setCompany(c);
    setShowLanding(false);
  }

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("emp_token");
    localStorage.removeItem("emp_user");
    localStorage.removeItem("emp_company");
    setUser(null);
    setCompany(null);
    setShowLanding(true);
  }

  // Step 0: Landing page
  if (showLanding && !company) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Step 1: Company must sign in
  if (!company) return <CompanyAuth onCompanyVerified={handleCompanyVerified} />;

  // Step 2: User must sign in
  if (!user) return <AuthPage onLogin={handleLogin} company={company} />;

  // Step 3: Dashboard
  return <DashboardPage user={user} onLogout={handleLogout} company={company} />;
}
