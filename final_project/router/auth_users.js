const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    // Generate a JWT token
    const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful!", token });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query; // Get review from query parameters

    if (!req.user) { // Use req.user instead of req.session.username, as it's stored in the token
        return res.status(403).json({ message: "You need to log in to post a review." });
    }

    const username = req.user; // Get the username from the token

    // Check if the book exists
    if (books[isbn]) {
        // If the book already has reviews, update or add the user's review
        if (!books[isbn].reviews) {
            books[isbn].reviews = {}; // Initialize reviews if not present
        }

        // Add or update the review under the user's username
        books[isbn].reviews[username] = review;

        return res.status(200).json({ message: `Review by ${username} added/updated successfully.` });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;  // Get the book's ISBN from the URL parameters

    // Extract the JWT token from the Authorization header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided." });
    }

    try {
        // Verify and decode the JWT token to get the username
        const decoded = jwt.verify(token.split(' ')[1], "your_jwt_secret_key");
        const username = decoded.username; // Get the username from the decoded token

        // Check if the book exists
        if (books[isbn]) {
            // Check if the book has reviews and if the user's review exists
            if (books[isbn].reviews && books[isbn].reviews[username]) {
                // Delete the user's review
                delete books[isbn].reviews[username];
                return res.status(200).json({ message: `Review by ${username} deleted successfully.` });
            } else {
                return res.status(404).json({ message: "No review found for this user." });
            }
        } else {
            return res.status(404).json({ message: "Book not found." });
        }

    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
