// ProfileUpdateForm.js

const express = require('express');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const pool = require('./db'); // Import your MySQL connection pool

const app = express();
const port = 3000;

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'BanBlitzcrank', // Replace with your actual secret key
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  // Here, you might want to fetch the user from the database based on the payload.sub (subject) field
  const user = { user_id: payload.sub, /* other user properties */ };

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
}));

app.use(passport.initialize());

app.use(express.json());

// Use your authRoutes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error('Stack Trace:', err.stack);
  
  // Handle specific errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Handle JWT validation errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  // Handle other errors
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
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
