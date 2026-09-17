import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";

const navigation = [
  ["/dashboard", "🏠", "Dashboard"],
  ["/activities", "📋", "Activities"],
  ["/calendar", "📅", "Calendar"],
  ["/analytics", "📊", "Analytics"],
  ["/history", "🕒", "History"],
  ["/profile", "⚙️", "Profile"],
];

export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function AppShell({ children, title, subtitle }) {
  const navigate = useNavigate();
  const user = getStoredUser() || { name: "User" };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>DailyActivity</h2>
          <span>Manage your day</span>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(([path, icon, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="dashboard-main page-main">
        <header className="dashboard-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="user-info">
            <div className="notification">🔔</div>
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
            <div className="user-name">
              <strong>{user.name}</strong>
              <span>User</span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default AppShell;
