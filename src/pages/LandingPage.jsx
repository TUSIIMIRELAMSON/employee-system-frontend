// src/pages/LandingPage.jsx
export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── Top Nav ── */}
      <nav style={{
        background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
        padding: "0 48px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, color: "#0061FF" }}>◆</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#1A1A2E", fontWeight: 400 }}>
            McLAM GROUP
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onGetStarted} style={{
            background: "transparent", border: "1px solid #E2E8F0",
            borderRadius: 8, padding: "8px 20px", color: "#64748B",
            fontFamily: "inherit", fontSize: "0.9rem", cursor: "pointer",
          }}>
            Sign In
          </button>
          <button onClick={onGetStarted} style={{
            background: "#0061FF", border: "none",
            borderRadius: 8, padding: "8px 20px", color: "#FFFFFF",
            fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <div style={{
        background: "linear-gradient(135deg, #0A2463 0%, #1652A8 50%, #0061FF 100%)",
        padding: "80px 48px 100px",
        textAlign: "center",
        color: "#FFFFFF",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.12)",
          borderRadius: 20, padding: "6px 18px", fontSize: "0.82rem",
          marginBottom: 24, color: "#93C5FD", fontWeight: 600, letterSpacing: "0.05em",
        }}>
          McLAM EMPLOYEE DATABASE MANAGEMENT SYSTEM
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 400, lineHeight: 1.2,
          marginBottom: 20, maxWidth: 700, margin: "0 auto 20px",
        }}>
          Manage Your Workforce<br />
          <span style={{ color: "#93C5FD" }}>Smarter & Faster</span>
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "#BFDBFE", maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.7,
        }}>
          A complete System for modern businesses. Register employees, track departments,
          manage salaries, and generate live reports — All in one place.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetStarted} style={{
            background: "#FFFFFF", color: "#0061FF", border: "none",
            borderRadius: 10, padding: "14px 32px", fontSize: "1rem",
            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
            Start for Free
          </button>
          <button onClick={onGetStarted} style={{
            background: "transparent", color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 10, padding: "14px 32px", fontSize: "1rem",
            fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 48, justifyContent: "center",
          marginTop: 64, flexWrap: "wrap",
        }}>
          {[
            ["Multi-Company", "One platform, many businesses"],
            ["Secure", "JWT + bcrypt + role-based access"],
            ["Real-time", "Live reports and charts"],
          ].map(([title, desc]) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>
                {title}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#93C5FD" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features Section ── */}
      <div style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem", color: "#1A1A2E", marginBottom: 12,
          }}>
            Everything Your HR Team Needs
          </h2>
          <p style={{ color: "#64748B", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>
            Built for businesses of all sizes — from startups to large organizations.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {[
            { icon: "👥", title: "Employee Management", desc: "Add, edit, and manage all employee records with ease. Auto-generate employee IDs." },
            { icon: "🏢", title: "Department Structure", desc: "Organize employees into departments. Assign managers and track team structures." },
            { icon: "💰", title: "Salary Tracking", desc: "Record and manage salary information for every employee with date ranges." },
            { icon: "📊", title: "Live Reports", desc: "Real-time charts showing gender split, department headcount, average salary and hiring trends." },
            { icon: "📲", title: "QR Onboarding", desc: "Send a QR code to new hires. They fill their details, you complete registration." },
            { icon: "🔐", title: "Secure Access", desc: "Role-based access control. Admins, managers and workers each see what they need." },
            { icon: "💬", title: "Manager Chat", desc: "Private, secure chat room for managers with secret code protection." },
            { icon: "🌍", title: "Multi-Company", desc: "One platform serves many companies. Each company's data is completely isolated." },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#FFFFFF", borderRadius: 14, padding: "28px 24px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{
        background: "#EFF6FF", padding: "80px 48px",
        borderTop: "1px solid #DBEAFE", borderBottom: "1px solid #DBEAFE",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem", color: "#1A1A2E", marginBottom: 12,
          }}>
            How It Works
          </h2>
          <p style={{ color: "#64748B", marginBottom: 56 }}>
            Get your company set up in minutes
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 32,
          }}>
            {[
              { step: "01", title: "Register Company", desc: "Sign up with your Business Registration Number and set a secret code" },
              { step: "02", title: "Create Account", desc: "Set up your admin user account for your company" },
              { step: "03", title: "Add Departments", desc: "Create your company's department structure" },
              { step: "04", title: "Onboard Employees", desc: "Use QR codes to register employees quickly and efficiently" },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#0061FF", color: "#FFFFFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", fontWeight: 700, margin: "0 auto 16px",
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: "0.97rem", fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div style={{
        background: "linear-gradient(135deg, #0A2463 0%, #0061FF 100%)",
        padding: "80px 48px", textAlign: "center", color: "#FFFFFF",
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "2.2rem", marginBottom: 16,
        }}>
          Ready to Get Started?
        </h2>
        <p style={{ color: "#BFDBFE", fontSize: "1rem", marginBottom: 36 }}>
          Register your company today — free to use, no credit card required.
        </p>
        <button onClick={onGetStarted} style={{
          background: "#FFFFFF", color: "#0061FF", border: "none",
          borderRadius: 10, padding: "16px 40px", fontSize: "1.05rem",
          fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          Register Your Company →
        </button>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: "#1A1A2E", padding: "32px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, color: "#0061FF" }}>◆</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1rem", color: "#FFFFFF" }}>
            McLAM GROUP
          </span>
        </div>
        <p style={{ color: "#64748B", fontSize: "0.82rem", margin: 0 }}>
          Employee Database Management System · © 2025 McLAM GROUP. All rights reserved.
        </p>
      </div>

    </div>
  );
}
