const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    try {
        // Check if email already exists
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) {
                    console.error("Registration database error:", err);
                    return res.status(500).json({
                        message: "Database error" + result.length
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                // Hash password before inserting
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                db.query(
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                    [name, email, hashedPassword],
                    (err, result) => {
                        if (err) {
                            console.error("Insert user error:", err);
                            return res.status(500).json({
                                message: "Registration failed"
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Registration successful",
                            userId: result.insertId
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email, pwd
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], (err, results) => {

        if (err) {
            console.error("Login database error:", err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = results[0];

        if (password !== user.pwd) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

module.exports = router;