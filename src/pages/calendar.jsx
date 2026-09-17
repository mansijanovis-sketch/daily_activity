import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell, { getStoredUser } from "../components/AppShell";
import { fetchActivities } from "../api/activities";

function Calendar() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchActivities(userId).then(setActivities).catch((loadError) => setError(loadError.message));
  }, [navigate, userId]);

  const hours = useMemo(() => {
    const grouped = {};
    activities.forEach((activity) => {
      const hour = Number(String(activity.time).slice(0, 2));
      const key = Number.isNaN(hour) ? "Unscheduled" : `${String(hour).padStart(2, "0")}:00`;
      grouped[key] = [...(grouped[key] || []), activity];
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [activities]);

  return <AppShell title="Calendar" subtitle="See your day as a simple, time-ordered plan.">
    <section className="page-toolbar"><div><h2>{dateLabel}</h2><p>{activities.length} scheduled activities</p></div></section>
    {error && <p className="login-error">{error}</p>}
    <section className="calendar-grid">
      {hours.length === 0 ? <div className="empty-state"><div>📅</div><h3>Your calendar is clear</h3><p>Add an activity from the dashboard to schedule your day.</p></div> : hours.map(([hour, items]) => <div className="calendar-row" key={hour}><div className="calendar-hour">{hour}</div><div className="calendar-items">{items.map((activity) => <div className={`calendar-event ${activity.status === "Completed" ? "event-completed" : ""}`} key={activity.id}><span className="event-dot" style={{ backgroundColor: activity.categoryColor || "#4f46e5" }} /><div><strong>{activity.title}</strong><span>{activity.category} · {activity.duration || 0} min</span></div><b>{activity.status === "Completed" ? "Done" : activity.priority}</b></div>)}</div></div>)}
    </section>
  </AppShell>;
}

export default Calendar;
