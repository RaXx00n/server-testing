// authRoutes.js

        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET         // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const router = express.Router();


// Your other dependencies and setup...

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
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
        


        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 
        // CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET CHANGE THIS SECRET 

          const token = jwt.sign({ username }, 'BanBlitzcrank');
  
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
  });

// Your other routes and middleware...

module.exports = router;
