const { Pool } = require("pg");

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "task_platform",
    password: "password123",
    port: 5432,
});

module.exports = pool;