// profileController.js
const pool = require('./db'); // Import your MySQL connection pool
const jwt = require('jsonwebtoken');

const updateProfile = async (formData) => {
    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint for updating the profile
      const response = await axios.put('/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${yourJwtToken}`,
        },
      });
  
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

module.exports = {
  updateProfile,
};
