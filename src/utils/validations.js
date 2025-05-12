const validator = require("validator");
/**
 * Validate sign up data
 * @description Validates the sign-up data for a new user.
 * @param  req
 */
const validateSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
    );
  }
};
/**
 * Validate profile edit data
 * @description Validates the profile edit data for a user.
 * @param req
 */
const validateProfileEditData = (req) => {
  const allowedFields = ["firstName", "lastName", "email"];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  return isAllowed;
};

module.exports = { validateSignup, validateProfileEditData };
