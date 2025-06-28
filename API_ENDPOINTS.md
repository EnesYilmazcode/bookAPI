# Book API - Complete Endpoint Reference with cURL Commands

This document provides a complete list of all REST API endpoints in the Book API project with sample cURL commands for testing each endpoint.

## Prerequisites

- API server running on `http://localhost:3000`
- Start server with: `npm start` or `node server.js`

## Complete API Endpoints List

### 1. GET /api/books - Get All Books

**Description**: Retrieve all books in the database

**cURL Command**:
```bash
curl -X GET http://localhost:3000/api/books \
  -H "Content-Type: application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "genre": "Fiction",
      "publishedYear": 1925,
      "description": "A classic American novel set in the Jazz Age...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. POST /api/books - Create New Book

**Description**: Add a new book to the database

**cURL Command**:
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "978-0-547-92822-7",
    "genre": "Fantasy",
    "publishedYear": 1937,
    "description": "A fantasy adventure novel about Bilbo Baggins journey to Erebor."
  }'
```

**Minimal Required Fields**:
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Book",
    "author": "Sample Author"
  }'
```

**Expected Response (201 Created)**:
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": "generated-uuid-here",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "978-0-547-92822-7",
    "genre": "Fantasy",
    "publishedYear": 1937,
    "description": "A fantasy adventure novel about Bilbo Baggins journey to Erebor.",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. GET /api/books/{id} - Get Specific Book

**Description**: Retrieve a single book by its ID

**cURL Command**:
```bash
curl -X GET http://localhost:3000/api/books/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "genre": "Fiction",
    "publishedYear": 1925,
    "description": "A classic American novel set in the Jazz Age...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Expected Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Book not found"
}
```

---

### 4. PUT /api/books/{id} - Update Book

**Description**: Update an existing book by its ID

**cURL Command (Full Update)**:
```bash
curl -X PUT http://localhost:3000/api/books/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Revised Edition",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "genre": "Classic Fiction",
    "publishedYear": 1925,
    "description": "A classic American novel set in the Jazz Age, telling the story of Jay Gatsby pursuit of the American Dream. Revised edition with new foreword."
  }'
```

**cURL Command (Partial Update)**:
```bash
curl -X PUT http://localhost:3000/api/books/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Literature"
  }'
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "title": "The Great Gatsby - Revised Edition",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "genre": "Classic Fiction",
    "publishedYear": 1925,
    "description": "A classic American novel set in the Jazz Age...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 5. DELETE /api/books/{id} - Delete Book

**Description**: Remove a book from the database by its ID

**cURL Command**:
```bash
curl -X DELETE http://localhost:3000/api/books/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "genre": "Fiction",
    "publishedYear": 1925,
    "description": "A classic American novel set in the Jazz Age...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. GET /api/books/search/{query} - Search Books

**Description**: Search for books by title, author, or genre

**cURL Commands**:

**Search by Author**:
```bash
curl -X GET http://localhost:3000/api/books/search/tolkien \
  -H "Content-Type: application/json"
```

**Search by Title**:
```bash
curl -X GET http://localhost:3000/api/books/search/gatsby \
  -H "Content-Type: application/json"
```

**Search by Genre**:
```bash
curl -X GET http://localhost:3000/api/books/search/fiction \
  -H "Content-Type: application/json"
```

**Search with URL Encoding (for phrases)**:
```bash
curl -X GET "http://localhost:3000/api/books/search/great%20gatsby" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "query": "gatsby",
  "data": [
    {
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "genre": "Fiction",
      "publishedYear": 1925,
      "description": "A classic American novel set in the Jazz Age...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Expected Response (No Results)**:
```json
{
  "success": true,
  "count": 0,
  "query": "nonexistent",
  "data": []
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Title and author are required fields"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Book not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve books",
  "error": "Database connection failed"
}
```

---

## Testing Sequence Example

Here's a complete testing sequence you can run:

```bash
# 1. Get all books
curl -X GET http://localhost:3000/api/books

# 2. Create a new book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Book", "author": "Test Author", "genre": "Test"}'

# 3. Search for the new book
curl -X GET http://localhost:3000/api/books/search/test

# 4. Get specific book (replace with actual ID from step 2)
curl -X GET http://localhost:3000/api/books/{book-id-from-step-2}

# 5. Update the book
curl -X PUT http://localhost:3000/api/books/{book-id-from-step-2} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Test Book", "author": "Test Author", "genre": "Updated Genre"}'

# 6. Delete the book
curl -X DELETE http://localhost:3000/api/books/{book-id-from-step-2}

# 7. Verify deletion
curl -X GET http://localhost:3000/api/books/{book-id-from-step-2}
```

---

## Summary of API Endpoints

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|----------------|
| `GET` | `/api/books` | Get all books | None |
| `POST` | `/api/books` | Create new book | `title`, `author` |
| `GET` | `/api/books/{id}` | Get specific book | None |
| `PUT` | `/api/books/{id}` | Update book | `title`, `author` |
| `DELETE` | `/api/books/{id}` | Delete book | None |
| `GET` | `/api/books/search/{query}` | Search books | None |

All endpoints return JSON responses with a consistent format including `success` boolean and appropriate data or error messages. 