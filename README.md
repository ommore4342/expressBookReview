Express Bookstore (Coursera Final Project)

Run

1. Install dependencies

```bash
npm install
```

2. Start server

```bash
npm start
```

API Endpoints (examples)

- Get all books:
  curl http://localhost:3000/books
- Get by ISBN:
  curl http://localhost:3000/books/isbn/9780143126560
- Get by author:
  curl http://localhost:3000/books/author/"Yuval%20Noah%20Harari"
- Get by title:
  curl http://localhost:3000/books/title/Road
- Get reviews for a book:
  curl http://localhost:3000/books/9780143126560/review
- Register a user:
  curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"bob","password":"pass"}'
- Login:
  curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"bob","password":"pass"}'
- Add/update review:
  curl -X POST http://localhost:3000/auth/review/9780143126560 -H "Content-Type: application/json" -d '{"username":"bob","password":"pass","review":"Nice read"}'
- Delete review:
  curl -X DELETE http://localhost:3000/auth/review/9780143126560 -H "Content-Type: application/json" -d '{"username":"bob","password":"pass"}'

Files of interest:

- [index.js](index.js#L1) - server entry
- [routes/general.js](routes/general.js#L1) - API implementation
- [data/books.json](data/books.json#L1) - sample books data
- [data/users.json](data/users.json#L1) - users store
- [public/general.js](public/general.js#L1) - Axios client examples
