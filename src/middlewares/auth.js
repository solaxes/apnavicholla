const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => { 
    // Read the token from the request cookies
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token not found");
        }

        const decodedMessage = await jwt.verify(token, "apnavicholla@123");
    
        const { id } = decodedMessage;

        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) { 
        res.status(400).json({
            message: "Error fetching user",
            error: err.message,
        });
    }   
};

module.exports = {
    userAuth
};