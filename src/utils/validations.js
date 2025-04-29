const validator = require("validator");
const validateSignup = (req) => {
  const {firstName, lastName, email, password} = req.body;
  
    if ( !firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    } 

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }
  
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
}

module.exports = { validateSignup };