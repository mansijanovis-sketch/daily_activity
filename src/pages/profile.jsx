import React from "react";
import { useNavigate } from "react-router-dom";
import AppShell, { getStoredUser } from "../components/AppShell";

function Profile() {
  const navigate = useNavigate();
  const user = getStoredUser();
  if (!user) { navigate("/login"); return null; }
  return <AppShell title="Profile" subtitle="Your account details and workspace settings.">
    <section className="profile-panel"><div className="profile-hero"><div className="profile-large-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div><div><h2>{user.name}</h2><p>{user.email}</p></div></div><div className="profile-details"><div><span>Full name</span><strong>{user.name}</strong></div><div><span>Email address</span><strong>{user.email || "Not provided"}</strong></div><div><span>Account type</span><strong>DailyActivity user</strong></div></div><button className="logout-inline" onClick={() => { sessionStorage.clear(); navigate("/login"); }}>Log out of this account</button></section>
  </AppShell>;
}

export default Profile;
