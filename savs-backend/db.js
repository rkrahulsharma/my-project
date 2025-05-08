const mysql = require('mysql2');

// Create both pool and direct connection for compatibility
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'savs_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Legacy connection for existing code
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'savs_db'
});

// Export both for backward compatibility
module.exports = {
  pool: pool.promise(), // For new async/await code
  getConnection: (callback) => connection.connect(callback ? callback : (err) => {
    if (err) throw err;
  }),
  connection // For existing query code
};