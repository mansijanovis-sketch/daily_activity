const express = require("express");
const router = express.Router();
const db = require("../db");

const activityFields = `
    SELECT id, user_id, act_name AS title, act_description AS description,
               DATE_FORMAT(act_date, '%Y-%m-%d') AS date, act_time AS time,
               act_duration AS duration, cat_name AS category,
           cat_color AS categoryColor, priority, status, created_at
    FROM activities
`;

router.get("/activities", (req, res) => {
    const userId = Number(req.query.userId);

    if (!Number.isInteger(userId) || userId < 1) {
        return res.status(400).json({ message: "A valid userId is required" });
    }

    db.query(
        `${activityFields} WHERE user_id = ? ORDER BY act_time ASC, id ASC`,
        [userId],
        (err, activities) => {
            if (err) {
                console.error("Get activities database error:", err);
                return res.status(500).json({ message: "Unable to load activities" });
            }

            res.json(activities);
        }
    );
});

router.post("/activities", (req, res) => {
    const { userId, title, description, date, time, duration, category, categoryColor, priority } = req.body;
    const numericUserId = Number(userId);
    const validPriorities = ["High", "Medium", "Low"];

    if (!Number.isInteger(numericUserId) || numericUserId < 1 || !title || !date || !time) {
        return res.status(400).json({ message: "userId, title, date and time are required" });
    }

    if (!validPriorities.includes(priority || "Medium")) {
        return res.status(400).json({ message: "Invalid priority" });
    }

    const sql = `
        INSERT INTO activities
            (user_id, act_name, act_description, act_date, act_time, act_duration,
               cat_name, cat_color, title, description, activity_time,
               category, priority)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [numericUserId, title.trim(), description || "", date, time, duration || 0,
            category || "Personal", categoryColor || "#4f46e5", title.trim(),
            description || "", time, category || "Personal", priority || "Medium"],
        (err, result) => {
            if (err) {
                console.error("Create activity database error:", err);
                return res.status(500).json({ message: "Unable to create activity" });
            }

            db.query(
                `${activityFields} WHERE id = ? AND user_id = ?`,
                [result.insertId, numericUserId],
                (selectErr, activities) => {
                    if (selectErr || activities.length === 0) {
                        return res.status(201).json({
                            id: result.insertId,
                            user_id: numericUserId,
                            title: title.trim(),
                            description: description || "",
                            date,
                            time,
                            category: category || "Personal",
                            priority: priority || "Medium",
                            status: "Pending"
                        });
                    }

                    res.status(201).json(activities[0]);
                }
            );
        }
    );
});

router.put("/activities/:id", (req, res) => {
    const activityId = Number(req.params.id);
    const { userId, title, description, date, time, duration, category, categoryColor, priority } = req.body;
    const numericUserId = Number(userId);
    const validPriorities = ["High", "Medium", "Low"];

    if (!Number.isInteger(activityId) || !Number.isInteger(numericUserId) || numericUserId < 1 || !title || !date || !time) {
        return res.status(400).json({ message: "Valid id, userId, title, date and time are required" });
    }

    if (!validPriorities.includes(priority || "Medium")) {
        return res.status(400).json({ message: "Invalid priority" });
    }

    const sql = `
        UPDATE activities
        SET act_name = ?, act_description = ?, act_date = ?, act_time = ?, act_duration = ?,
            cat_name = ?, cat_color = ?, title = ?, description = ?,
            activity_time = ?, category = ?, priority = ?
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        title.trim(), description || "", date, time, duration || 0,
        category || "Personal", categoryColor || "#4f46e5", title.trim(),
        description || "", time, category || "Personal", priority || "Medium",
        activityId, numericUserId
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Update activity database error:", err);
            return res.status(500).json({ message: "Unable to update activity" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Activity not found" });
        }

        db.query(
            `${activityFields} WHERE id = ? AND user_id = ?`,
            [activityId, numericUserId],
            (selectErr, activities) => {
                if (selectErr || activities.length === 0) {
                    return res.status(500).json({ message: "Unable to load updated activity" });
                }
                res.json(activities[0]);
            }
        );
    });
});

router.patch("/activities/:id/status", (req, res) => {
    const activityId = Number(req.params.id);
    const userId = Number(req.body.userId);
    const status = req.body.status;

    if (!Number.isInteger(activityId) || !Number.isInteger(userId) || !["Pending", "Completed"].includes(status)) {
        return res.status(400).json({ message: "Valid activity id, userId and status are required" });
    }

    db.query(
        "UPDATE activities SET status = ? WHERE id = ? AND user_id = ?",
        [status, activityId, userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Unable to update activity" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Activity not found" });
            }
            res.json({ success: true });
        }
    );
});

router.delete("/activities/:id", (req, res) => {
    const activityId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (!Number.isInteger(activityId) || !Number.isInteger(userId)) {
        return res.status(400).json({ message: "Valid activity id and userId are required" });
    }

    db.query(
        "DELETE FROM activities WHERE id = ? AND user_id = ?",
        [activityId, userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Unable to delete activity" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Activity not found" });
            }
            res.status(204).send();
        }
    );
});

module.exports = router;