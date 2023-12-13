const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USR,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

pool.on('error', (err) => {
    console.error('MySQL Pool Error:', err.message);
});

(async () => {
    try {
        // getConnection with a timeout value to make it wait
        const connection = await pool.getConnection();
        console.log("Successfully connected to the MySQL server !!");
        connection.release();
    } catch (error) {
        console.log("Error in connecting to MySQL database", error);
    }
})();

module.exports = pool;