import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell, { getStoredUser } from "../components/AppShell";
import { fetchActivities } from "../api/activities";

function History() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { if (!userId) { navigate("/login"); return; } fetchActivities(userId).then(setActivities).catch((loadError) => setError(loadError.message)); }, [navigate, userId]);
  const completed = activities.filter((activity) => activity.status === "Completed");
  return <AppShell title="History" subtitle="A record of the routines you have completed.">
    <section className="page-toolbar"><div><h2>Completed activities</h2><p>{completed.length} finished items</p></div></section>
    {error && <p className="login-error">{error}</p>}
    <section className="history-list">{completed.length === 0 ? <div className="empty-state"><div>🕒</div><h3>Nothing completed yet</h3><p>Completed activities will appear here.</p></div> : completed.map((activity) => <article className="history-item" key={activity.id}><div className="history-check">✓</div><div><h3>{activity.title}</h3><p>{activity.description || "No description"}</p></div><span>{activity.category} · {activity.time}</span></article>)}</section>
  </AppShell>;
}

export default History;
