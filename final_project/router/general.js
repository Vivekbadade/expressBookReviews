const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
    return res.status(200).json(books);
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Yet to be implemented" });
  }

  return res.status(200).json(book);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
  
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }
  
    return res.status(200).json(filteredBooks);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
  
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }
  
    return res.status(200).json(filteredBooks);
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
  
    if (!book || !book.reviews) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    return res.status(200).json(book.reviews);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
