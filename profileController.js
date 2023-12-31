// profileController.js

const pool = require('./db'); // Replace with the correct path to your MySQL connection pool
const jwt = require('jsonwebtoken');

const secretKey = 'BanBlitzcrank'; // Replace with your actual secret key

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

const updateProfile = async (req, userId, data) => {
  try {
    const authToken = req.headers.authorization;
    console.log('Received Token:', authToken); // Add this line for logging

    if (!authToken) {
      throw new Error('JWT token not provided');
    }

    // Extract the token from the authorization header
    const token = authToken.split(' ')[1];

    // Verify the token
    const decoded = await verifyToken(token);

    console.log('Extracted token', token);
    console.log('Decoded token', decoded);
    // Ensure that the user ID from the token matches the provided userId
    if (decoded.user_id !== userId) {
      throw new Error('Invalid user ID');
    }

    const { name, school, email, avatarUrl } = data;

    // Example SQL query to update user profile
    const query = `
      UPDATE profiles
      SET
        ${name ? 'name = ?,' : ''}
        ${school ? 'school = ?,' : ''}
        ${email ? 'email = ?,' : ''}
        ${avatarUrl ? 'avatar_url = ?' : ''}
      WHERE user_id = ?;
    `;

    const values = [name, school, email, avatarUrl, userId].filter(Boolean);

    // Execute the SQL query
    await pool.query(query, values);

    const result = await pool.query(query, values);

    console.log('Database Query Result:', result);

    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error.message || error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};

module.exports = {
  verifyToken,
  updateProfile,
};
