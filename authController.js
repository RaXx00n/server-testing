// authController.js
const pool = require('./db'); // Import your MySQL connection pool
const jwt = require('jsonwebtoken');

const login = (req, res) => {
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

      // Upon successful login
      if (results.length > 0) {
        console.log('Login successful:', username);

        const token = jwt.sign({ username }, 'insecurekeypleasechange12345');

        console.log('JWT Token:', token);

        // Send the token in both the headers and the response body
        res.header('Authorization', `Bearer ${token}`);
        res.json({ success: true, message: 'Login successful', token });

        console.log('Token:', token);
      } else {
        console.log('Invalid credentials:', username);
        res.json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
};

module.exports = {
  login,
};
