import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell, { getStoredUser } from "../components/AppShell";
import { fetchActivities, removeActivity, setActivityStatus } from "../api/activities";

function Activities() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const [activities, setActivities] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchActivities(userId).then(setActivities).catch((loadError) => setError(loadError.message));
  }, [navigate, userId]);

  const categories = useMemo(
    () => ["All", ...new Set(activities.map((activity) => activity.category).filter(Boolean))],
    [activities]
  );
  const filteredActivities = activities.filter((activity) =>
    (statusFilter === "All" || activity.status === statusFilter) &&
    (categoryFilter === "All" || activity.category === categoryFilter)
  );

  const toggleStatus = async (activity) => {
    try {
      const status = activity.status === "Completed" ? "Pending" : "Completed";
      await setActivityStatus(activity.id, user.id, status);
      setActivities((current) => current.map((item) => item.id === activity.id ? { ...item, status } : item));
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const deleteItem = async (activity) => {
    if (!window.confirm(`Delete ${activity.title}?`)) return;
    try {
      await removeActivity(activity.id, user.id);
      setActivities((current) => current.filter((item) => item.id !== activity.id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <AppShell title="Activities" subtitle="Every task in one place, ready to manage.">
      <section className="page-toolbar">
        <div>
          <h2>All Activities</h2>
          <p>{filteredActivities.length} of {activities.length} activities shown</p>
        </div>
        <Link className="add-activity-btn" to="/dashboard">+ Add Activity</Link>
      </section>
      <div className="filter-bar">
        <label htmlFor="activity-status-filter">Status
          <select id="activity-status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option><option>Pending</option><option>Completed</option>
          </select>
        </label>
        <label htmlFor="activity-category-filter">Category
          <select id="activity-category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="login-error">{error}</p>}
      <section className="activity-list page-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state"><div>📋</div><h3>No matching activities</h3><p>Adjust the filters or add a new activity.</p></div>
        ) : filteredActivities.map((activity) => (
          <article className={`activity-card ${activity.status === "Completed" ? "activity-completed" : ""}`} key={activity.id}>
            <div className="activity-time"><span>TIME</span><strong>{activity.time}</strong></div>
            <div className="activity-content"><div className="activity-title-row"><h3>{activity.title}</h3><span className={`priority ${activity.priority.toLowerCase()}`}>{activity.priority}</span></div><p>{activity.description || "No description"}</p><div className="activity-details"><span>📁 {activity.category}</span><span>•</span><span>{activity.duration || 0} min</span><span>•</span><span className={`status ${activity.status.toLowerCase()}`}>{activity.status}</span></div></div>
            <div className="activity-actions"><button className="complete-btn" onClick={() => toggleStatus(activity)} title="Toggle status">{activity.status === "Completed" ? "✓" : "○"}</button><button className="delete-btn" onClick={() => deleteItem(activity)} title="Delete">🗑</button></div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

export default Activities;
