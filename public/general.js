const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// 1. Get all books using Promise
function getAllBooks() {
    return axios.get(`${API_BASE}/books`)
        .then(response => {
            console.log('All Books:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error(
                error.response ? error.response.data : error.message
            );
        });
}

// 2. Get book by ISBN using async/await
async function getBooksByISBN(isbn) {
    try {
        const response = await axios.get(
            `${API_BASE}/books/isbn/${isbn}`
        );

        console.log('Book by ISBN:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            error.response ? error.response.data : error.message
        );
    }
}

// 3. Get books by Author using async/await
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `${API_BASE}/books/author/${encodeURIComponent(author)}`
        );

        console.log('Books by Author:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            error.response ? error.response.data : error.message
        );
    }
}

// 4. Get books by Title using async/await
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `${API_BASE}/books/title/${encodeURIComponent(title)}`
        );

        console.log('Books by Title:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            error.response ? error.response.data : error.message
        );
    }
}

module.exports = {
    getAllBooks,
    getBooksByISBN,
    getBooksByAuthor,
    getBooksByTitle
};