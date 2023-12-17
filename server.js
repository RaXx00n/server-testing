const express = require('express');
const https = require('https');
const fs = require('fs');
const mysql = require('mysql');

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'auth',
  connectionLimit: 10,
});

app.use(express.json());

//const sslOptions = {
//  key: fs.readFileSync('server-key.pem'),
 // cert: fs.readFileSync('server-cert.pem'),
 // ca: fs.readFileSync('ca-key.pem'),
//};


//const server = https.createServer(sslOptions, app);

const server = https.createServer(app);

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password });

  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  // Use connection from the pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error getting connection from pool:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    connection.query(query, [username, password], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      if (results.length > 0) {
        console.log('Login successful:', username);
        res.json({ success: true, message: 'Login successful' });
      } else {
        console.log('Invalid credentials:', username);
        res.json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
