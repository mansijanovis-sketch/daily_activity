import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell, { getStoredUser } from "../components/AppShell";
import { fetchActivities } from "../api/activities";

function Analytics() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { if (!userId) { navigate("/login"); return; } fetchActivities(userId).then(setActivities).catch((loadError) => setError(loadError.message)); }, [navigate, userId]);
  const completed = activities.filter((activity) => activity.status === "Completed").length;
  const duration = activities.reduce((sum, activity) => sum + Number(activity.duration || 0), 0);
  const categories = useMemo(() => Object.entries(activities.reduce((result, activity) => { result[activity.category] = (result[activity.category] || 0) + 1; return result; }, {})), [activities]);
  const priorities = useMemo(() => Object.entries(activities.reduce((result, activity) => { result[activity.priority] = (result[activity.priority] || 0) + 1; return result; }, {})), [activities]);
  return <AppShell title="Analytics" subtitle="Understand where your time and attention go.">
    {error && <p className="login-error">{error}</p>}
    <section className="stats-container analytics-stats"><div className="stat-card"><div className="stat-icon total">📋</div><div><span>Total</span><h3>{activities.length}</h3></div></div><div className="stat-card"><div className="stat-icon completed">✓</div><div><span>Completion rate</span><h3>{activities.length ? Math.round(completed / activities.length * 100) : 0}%</h3></div></div><div className="stat-card"><div className="stat-icon progress">⏱</div><div><span>Planned minutes</span><h3>{duration}</h3></div></div></section>
    <div className="insight-grid"><section className="insight-panel"><h2>By category</h2>{categories.length === 0 ? <p className="muted">No activity data yet.</p> : categories.map(([name, count]) => <div className="metric-row" key={name}><span>{name}</span><div className="metric-track"><i style={{ width: `${Math.max(12, count / activities.length * 100)}%` }} /></div><strong>{count}</strong></div>)}</section><section className="insight-panel"><h2>By priority</h2>{priorities.length === 0 ? <p className="muted">No priority data yet.</p> : priorities.map(([name, count]) => <div className="metric-row" key={name}><span>{name}</span><div className="metric-track"><i className={`metric-${name.toLowerCase()}`} style={{ width: `${Math.max(12, count / activities.length * 100)}%` }} /></div><strong>{count}</strong></div>)}</section></div>
  </AppShell>;
}

export default Analytics;
