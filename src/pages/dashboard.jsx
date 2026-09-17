import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { API_BASE } from "../api/config";

function Dashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingActivityId, setUpdatingActivityId] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: today,
    time: "",
    duration: 0,
    category: "Personal",
    categoryColor: "#4f46e5",
    priority: "Medium",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    if (!user) {
      navigate("/login");
      return;
    }

    const { id } = JSON.parse(user);
    fetch(`${API_BASE}/api/activities?userId=${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load activities");
        setActivities(data);
      })
      .catch((loadError) => setError(loadError.message));
  }, [navigate]);

  // Get user
  const user = JSON.parse(sessionStorage.getItem("user")) || {
    name: "User",
  };

  // Statistics
  const totalActivities = activities.length;

  const completedActivities = activities.filter(
    (activity) => activity.status === "Completed"
  ).length;

  const pendingActivities = activities.filter(
    (activity) => activity.status === "Pending"
  ).length;

  const progress =
    totalActivities === 0
      ? 0
      : Math.round((completedActivities / totalActivities) * 100);

  const handleAddActivity = async (e) => {
    e.preventDefault();

    if (!newActivity.title || !newActivity.time) {
      setError("Please enter activity title and time.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const endpoint = editingActivityId
        ? `${API_BASE}/api/activities/${editingActivityId}`
        : `${API_BASE}/api/activities`;
      const response = await fetch(endpoint, {
        method: editingActivityId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newActivity, userId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to add activity");
      setActivities((current) => editingActivityId
        ? current.map((activity) => activity.id === editingActivityId ? data : activity)
        : [...current, data]
      );
      setNewActivity({ title: "", description: "", date: today, time: "", duration: 0, category: "Personal", categoryColor: "#4f46e5", priority: "Medium" });
      setEditingActivityId(null);
      setShowForm(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const editActivity = (activity) => {
    setEditingActivityId(activity.id);
    setNewActivity({
      title: activity.title,
      description: activity.description || "",
      date: activity.date ? String(activity.date).slice(0, 10) : today,
      time: activity.time.slice(0, 5),
      duration: activity.duration || 0,
      category: activity.category || "Personal",
      categoryColor: activity.categoryColor || "#4f46e5",
      priority: activity.priority || "Medium",
    });
    setError("");
    setShowForm(true);
  };

  const openAddActivity = () => {
    setEditingActivityId(null);
    setNewActivity({ title: "", description: "", date: today, time: "", duration: 0, category: "Personal", categoryColor: "#4f46e5", priority: "Medium" });
    setError("");
    setShowForm(true);
  };

  const closeActivityForm = () => {
    setEditingActivityId(null);
    setShowForm(false);
  };

  const completeActivity = async (id, status) => {
    const nextStatus = status === "Completed" ? "Pending" : "Completed";
    try {
      setUpdatingActivityId(id);
      setError("");
      const response = await fetch(`${API_BASE}/api/activities/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update activity");
      setActivities((current) => current.map((activity) =>
        activity.id === id ? { ...activity, status: nextStatus } : activity
      ));
    } catch (statusError) {
      setError(statusError.message || "Unable to connect to server");
    } finally {
      setUpdatingActivityId(null);
    }
  };

  const deleteActivity = async (id) => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_BASE}/api/activities/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete activity");
      setActivities((current) => current.filter((activity) => activity.id !== id));
      setActivityToDelete(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeleting(false);
    }
  };

  const requestDeleteActivity = (activity) => {
    setError("");
    setActivityToDelete(activity);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>DailyActivity</h2>
          <span>Manage your day</span>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="nav-item active"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/activities"
            className="nav-item"
          >
            📋 Activities
          </Link>

          <Link
            to="/calendar"
            className="nav-item"
          >
            📅 Calendar
          </Link>

          <Link
            to="/analytics"
            className="nav-item"
          >
            📊 Analytics
          </Link>

          <Link
            to="/history"
            className="nav-item"
          >
            🕒 History
          </Link>

          <Link
            to="/profile"
            className="nav-item"
          >
            ⚙️ Profile
          </Link>

        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <h1>Daily Routine</h1>
            <p>
              Here's your schedule and activity overview.
            </p>
          </div>

          <div className="user-info">
            <div className="notification">
              🔔
            </div>

            <div className="user-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="user-name">
              <strong>{user.name}</strong>
              <span>User</span>
            </div>
          </div>

        </header>

        {/* WELCOME */}
        <section className="welcome-section">

          <div>
            <h2>
              Good Morning, {user.name} 👋
            </h2>

            <p>
              Plan your day and stay productive.
            </p>
          </div>

          <button
            className="add-activity-btn"
            onClick={openAddActivity}
          >
            + Add Activity
          </button>

        </section>

        {error && <p className="login-error">{error}</p>}

        {/* STATISTICS */}
        <section className="stats-container">

          <div className="stat-card">
            <div className="stat-icon total">
              📋
            </div>

            <div>
              <span>Total Activities</span>
              <h3>{totalActivities}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <h3>{completedActivities}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <h3>{pendingActivities}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon progress">
              📈
            </div>

            <div>
              <span>Today's Progress</span>
              <h3>{progress}%</h3>
            </div>
          </div>

        </section>

        {/* PROGRESS */}
        <section className="progress-section">

          <div className="progress-header">
            <div>
              <h3>Today's Progress</h3>
              <p>
                {completedActivities} of {totalActivities} activities
                completed
              </p>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

        </section>

        {/* ACTIVITIES */}
        <section className="activities-section">

          <div className="section-header">
            <div>
              <h2>Today's Activities</h2>
              <p>Manage your daily routine</p>
            </div>

            <Link to="/activities">
              View All →
            </Link>
          </div>

          <div className="activity-list">

            {activities.length === 0 ? (
              <div className="empty-state">
                <div>📋</div>
                <h3>No activities yet</h3>
                <p>
                  Add your first activity to start your day.
                </p>
              </div>
            ) : (
              activities.map((activity) => (

                <div
                  className={`activity-card ${
                    activity.status === "Completed"
                      ? "activity-completed"
                      : ""
                  }`}
                  key={activity.id}
                >

                  <div className="activity-time">
                    <span>TIME</span>
                    <strong>{activity.time}</strong>
                  </div>

                  <div className="activity-content">

                    <div className="activity-title-row">

                      <h3>{activity.title}</h3>

                      <span
                        className={`priority ${activity.priority.toLowerCase()}`}
                      >
                        {activity.priority}
                      </span>

                    </div>

                    <p>
                      {activity.description}
                    </p>

                    <div className="activity-details">

                      <span>
                        📅 {activity.date ? String(activity.date).slice(0, 10) : "Today"}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        📁 {activity.category}
                      </span>

                      <span>
                        •
                      </span>

                      <span
                        className={`status ${activity.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {activity.status}
                      </span>

                    </div>

                  </div>

                  <div className="activity-actions">

                    <button
                      className="edit-btn"
                      onClick={() => editActivity(activity)}
                      title="Edit"
                    >
                      ✏️
                    </button>

                    <button
                      className="complete-btn"
                      onClick={() => completeActivity(activity.id, activity.status)}
                      title="Complete"
                      disabled={updatingActivityId === activity.id}
                    >
                      {activity.status === "Completed"
                        ? "✓"
                        : "○"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => requestDeleteActivity(activity)}
                      title="Delete"
                    >
                      🗑
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>

        </section>

      </main>

      {/* ADD ACTIVITY MODAL */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={closeActivityForm}
        >

          <div
            className="activity-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>{editingActivityId ? "Edit Activity" : "Add Activity"}</h2>
                <p>{editingActivityId ? "Update your daily activity" : "Create a new daily activity"}</p>
              </div>

              <button
                className="close-btn"
                onClick={closeActivityForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleAddActivity}>

              <div className="form-group">
                <label htmlFor="activity-title">Activity Title</label>

                <input
                  id="activity-title"
                  type="text"
                  placeholder="e.g. Study React"
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity-description">Description</label>

                <textarea
                  id="activity-description"
                  placeholder="Enter activity description"
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="activity-date">Date</label>
                <input
                  id="activity-date"
                  type="date"
                  value={newActivity.date}
                  min={today}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, date: e.target.value })
                  }
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="activity-time">Time</label>

                  <input
                    id="activity-time"
                    type="time"
                    value={newActivity.time}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="activity-category">Category</label>

                  <select
                    id="activity-category"
                    value={newActivity.category}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Personal</option>
                    <option>Work</option>
                    <option>Study</option>
                    <option>Health</option>
                    <option>Exercise</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="activity-duration">Duration (minutes)</label>
                <input
                  id="activity-duration"
                  type="number"
                  min="0"
                  value={newActivity.duration}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, duration: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity-priority">Priority</label>

                <select
                  id="activity-priority"
                  value={newActivity.priority}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      priority: e.target.value,
                    })
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeActivityForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingActivityId ? "Save Changes" : "Add Activity"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {activityToDelete && (
        <div
          className="modal-overlay"
          onClick={() => !deleting && setActivityToDelete(null)}
        >
          <div
            className="confirmation-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirmation-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirmation-title">Delete activity?</h2>
            <p>
              Are you sure you want to delete <strong>{activityToDelete.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setActivityToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={() => deleteActivity(activityToDelete.id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;