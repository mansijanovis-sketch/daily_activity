const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());
app.use(express.json());

const registrationRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");

app.use("/api", registrationRoutes);
app.use("/api", activityRoutes);

app.listen(5000,()=>{
    console.log("Server Running");
});