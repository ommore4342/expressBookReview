// Example client-side calls using Axios to interact with the bookstore API.
// This file contains both promise-based and async/await examples.
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Promise-based: get all books
function getAllBooksPromise() {
  axios.get(`${API_BASE}/books`)
    .then(res => console.log('All books (promise):', res.data))
    .catch(err => console.error(err.response ? err.response.data : err.message));
}

// Async/await: get books by author
async function getBooksByAuthor(author) {
  try {
    const res = await axios.get(`${API_BASE}/books/author/${encodeURIComponent(author)}`);
    console.log(`Books by ${author}:`, res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

// Async/await: get book by ISBN
async function getBookByISBN(isbn) {
  try {
    const res = await axios.get(`${API_BASE}/books/isbn/${isbn}`);
    console.log(`Book ${isbn}:`, res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

// Export for use in Node-based test scripts
module.exports = { getAllBooksPromise, getBooksByAuthor, getBookByISBN };
