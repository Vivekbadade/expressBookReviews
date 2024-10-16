const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']; // Expecting the token in the Authorization header

    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    try {
        // Verify JWT token and extract user info (username)
        const decoded = jwt.verify(token.split(' ')[1], "your_jwt_secret_key");
        req.user = decoded.username; // Attach the username to request as `req.user`
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
