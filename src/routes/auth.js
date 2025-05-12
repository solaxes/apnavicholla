const express = require('express');
const User = require('../models/user'); // Adjust the path as per your project structure
const { validateSignup } = require("../utils/validations");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

/**
 * POST /auth/register
 * @description Registers a new user by hashing the password and saving the user data to the database.
 * @async
 * @param {object} req - Express request object containing user details in the body.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with success or error message.
 */
authRouter.post("/auth/register", async (req, res) => {
    //console.log("Request body", req.body);
    try {
      validateSignup(req);
  
      const { password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
      const user = new User(req.body);
      await user.save();
      res.status(200).json({
        message: "User created successfully",
      });
    } catch (err) {
      res.status(400).json({
        message: "Error creating user",
        error: err.message,
      });
    }
});

/**
 * POST /auth/login
 * @description Logs in a user by validating their credentials and generating a JWT token.
 * @async
 * @param {object} req - Express request object containing email and password in the body.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with success message and sets a JWT token in cookies, or an error message.
 */
authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isMatch = await user.validatePassword(password); // Validate password
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = await user.getJWT(); // Create a JWT token

    // ADD jwt token to cookies
    res.cookie("token", token);
    res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
});

/**
 * POST /auth/logout
 * @description Logs out a user by clearing the JWT token from cookies.
 */
authRouter.post('/auth/logout', async (req, res) => { 
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = authRouter;