// src/App.jsx
import { useState } from "react";
import AuthPage      from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

// Load Google Fonts
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap";
link.rel  = "stylesheet";
document.head.appendChild(link);

export default function App() {
  const stored = localStorage.getItem("emp_user");
  const token  = localStorage.getItem("emp_token");

  const [user, setUser] = useState(stored && token ? JSON.parse(stored) : null);

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("emp_token");
    localStorage.removeItem("emp_user");
    setUser(null);
  }

  if (!user) return <AuthPage onLogin={handleLogin} />;
  return <DashboardPage user={user} onLogout={handleLogout} />;
}
