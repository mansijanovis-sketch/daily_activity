import { API_BASE } from "./config";

export async function fetchActivities(userId) {
  const response = await fetch(`${API_BASE}/api/activities?userId=${userId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load activities");
  return data;
}

export async function setActivityStatus(activityId, userId, status) {
  const response = await fetch(`${API_BASE}/api/activities/${activityId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to update activity");
  return data;
}

export async function removeActivity(activityId, userId) {
  const response = await fetch(`${API_BASE}/api/activities/${activityId}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Unable to delete activity");
  }
}
