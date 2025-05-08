const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rahul2412',   // ✅ use your password
  database: 'savs_db'
});


module.exports = db;
