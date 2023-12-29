const express = require('express');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const pool = require('./db'); // Import your MySQL connection pool

const app = express();
const port = 3000;

app.use(express.json());

// Use your authRoutes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Generic error response
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
});

//const sslOptions = {
//  key: fs.readFileSync('server-key.pem'),
 // cert: fs.readFileSync('server-cert.pem'),
 // ca: fs.readFileSync('ca-key.pem'),
//};

//const server = https.createServer(sslOptions, app);
const server = https.createServer(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
