const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();
const pool = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Port
const PORT = process.env.PORT || 5000;

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Home route
app.get("/", (req, res) => {

    res.json({
        message: "Cloud Task Platform API is running"
    });

});



// Database test route

app.get("/db-test", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Database connection failed"
        });

    }

});

// Start server
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});