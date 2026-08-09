const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const fileLocks = new Map();

function withLock(file, fn) {
  const prev = fileLocks.get(file) || Promise.resolve();
  const next = prev.then(() => fn()).catch(() => {});
  fileLocks.set(file, next);
  return next;
}

async function readJson(file) {
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    return {};
  }
}

async function writeJson(file, obj) {
  await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
}

// Get all books
router.get('/books', async (req, res) => {
  const books = await readJson(BOOKS_FILE);
  res.json(books);
});

// Get book by ISBN
router.get('/books/isbn/:isbn', async (req, res) => {
  const books = await readJson(BOOKS_FILE);
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Get books by author
router.get('/books/author/:author', async (req, res) => {
  const books = await readJson(BOOKS_FILE);
  const q = req.params.author.toLowerCase();
  const result = Object.values(books).filter(b => b.author.toLowerCase().includes(q));
  res.json(result);
});

// Get books by title
router.get('/books/title/:title', async (req, res) => {
  const books = await readJson(BOOKS_FILE);
  const q = req.params.title.toLowerCase();
  const result = Object.values(books).filter(b => b.title.toLowerCase().includes(q));
  res.json(result);
});

// Get reviews for a book
router.get('/books/:isbn/review', async (req, res) => {
  const books = await readJson(BOOKS_FILE);
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book.reviews || {});
});

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  await withLock(USERS_FILE, async () => {
    const users = await readJson(USERS_FILE) || [];
    if (users.find(u => u.username === username)) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    users.push({ username, password });
    await writeJson(USERS_FILE, users);
    res.json({ message: 'User registered successfully' });
  });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  const users = await readJson(USERS_FILE) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

// Add or update a review (requires username/password in body)
router.post('/auth/review/:isbn', async (req, res) => {
  const { username, password, review } = req.body;
  if (!username || !password || !review) return res.status(400).json({ message: 'username, password and review required' });

  const users = await readJson(USERS_FILE) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  await withLock(BOOKS_FILE, async () => {
    const books = await readJson(BOOKS_FILE);
    const book = books[req.params.isbn];
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    book.reviews = book.reviews || {};
    book.reviews[username] = review;
    await writeJson(BOOKS_FILE, books);
    res.json({ message: 'Review added/updated', reviews: book.reviews });
  });
});

// Delete a review
router.delete('/auth/review/:isbn', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const users = await readJson(USERS_FILE) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  await withLock(BOOKS_FILE, async () => {
    const books = await readJson(BOOKS_FILE);
    const book = books[req.params.isbn];
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    book.reviews = book.reviews || {};
    if (book.reviews[username]) delete book.reviews[username];
    await writeJson(BOOKS_FILE, books);
    res.json({ message: 'Review deleted', reviews: book.reviews });
  });
});

module.exports = router;
