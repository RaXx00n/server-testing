// db.js
const mysql = require('mysql');

const pool = mysql.createPool({
  host: '172.31.9.191',
  user: 'root',
  password: 'root',
  database: 'auth',
  connectionLimit: 10,
});

module.exports = pool;
