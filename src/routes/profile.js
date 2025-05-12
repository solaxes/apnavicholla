const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Adjust the path as per your project structure
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid profile edit data");
    }

    const user = req.user;

    const userId = user._id;
    // another logic for updating all the fields in single request

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    // this is simple way to update the user
    // user.firstName = req.body.firstName;
    // user.lastName = req.body.lastName;
    // user.email = req.body.email;

    // await user.save();

    res.status(200).json({
      message: `${user.firstName} ${user.lastName}, your account has been updated successfully`,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error updating user",
      error: err.message,
    });
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required");
    }

    const isMatch = await user.validatePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: "Error updating password",
      error: err.message,
    });
  }
});

profileRouter.get("/user", userAuth, async (req, res) => {
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

module.exports = profileRouter;
