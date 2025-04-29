const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validations");
const bcrypt = require("bcrypt");
const port = 3000;
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
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
app.patch("/user", async (req, res) => {
  try {
    userId = req.body.userId;
    await User.findByIdAndUpdate(userId, {
      email: req.body.email,
    });
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error updating user",
      error: err.message,
    });
  }
});

app.get("/user", async (req, res) => {
  try {
    await User.findOne({ email: req.body.email })
      .then((users) => {
        if (!users) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.status(200).json({
          message: "Users fetched successfully",
          data: users,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error fetching users",
          error: err.message,
        });
      });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching users, something happened",
      error: err.message,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Dababase conencted successfully");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log(err);
  });
