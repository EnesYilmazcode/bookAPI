# 📚 Book Library API

A modern, full-stack RESTful API for managing a book collection with CRUD operations, built with Node.js, Express, and vanilla JavaScript frontend. Features comprehensive testing suite with 87.9% code coverage including unit tests, integration tests, and API endpoint tests.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete books
- **Search Functionality**: Search books by title, author, or genre
- **Modern UI**: Beautiful, responsive frontend interface
- **Data Persistence**: JSON file-based database storage
- **Input Validation**: Server-side validation for data integrity
- **Error Handling**: Comprehensive error handling and user feedback
- **RESTful Design**: Following REST API conventions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Comprehensive Testing**: Unit, integration, and API tests with high coverage
- **Test-Driven Development**: Robust testing suite with Jest and Supertest

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **UUID**: For generating unique book IDs
- **CORS**: Cross-Origin Resource Sharing support
- **Body-parser**: Parse incoming request bodies

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS
- **Fetch API**: For making HTTP requests

### Database
- **JSON File**: Simple file-based storage for development

### Testing
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Express applications
- **Test Coverage**: Comprehensive code coverage reporting

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## 🔧 Installation & Setup

1. **Clone or download the project files**
   ```bash
   # If you have the files in a directory, navigate to it
   cd bookAPI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # For development (with auto-restart)
   npm run dev
   
   # For production
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - API Base: `http://localhost:3000/api/books`

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api/books
```

### Endpoints

#### 1. Get All Books
```http
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "uuid-string",
      "title": "Book Title",
      "author": "Author Name",
      "isbn": "978-0-123456-78-9",
      "genre": "Fiction",
      "publishedYear": 2023,
      "description": "Book description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Book by ID
```http
GET /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Book Title",
    "author": "Author Name",
    // ... other fields
  }
}
```

#### 3. Create New Book
```http
POST /api/books
```

**Request Body:**
```json
{
  "title": "New Book Title",        // Required
  "author": "Author Name",          // Required
  "isbn": "978-0-123456-78-9",     // Optional
  "genre": "Fiction",              // Optional
  "publishedYear": 2023,           // Optional
  "description": "Book description" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": "generated-uuid",
    "title": "New Book Title",
    // ... other fields with timestamps
  }
}
```

#### 4. Update Book
```http
PUT /api/books/:id
```

**Request Body:** Same as Create Book

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    // Updated book object
  }
}
```

#### 5. Delete Book
```http
DELETE /api/books/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    // Deleted book object
  }
}
```

#### 6. Search Books
```http
GET /api/books/search/:query
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "query": "search term",
  "data": [
    // Array of matching books
  ]
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Comprehensive Testing Suite

This project features a robust testing suite with **87.9% code coverage** that includes unit tests, integration tests, and API endpoint tests.

### Test Coverage Report

```
-----------|---------|----------|---------|---------|-----------------------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------|---------|----------|---------|---------|-----------------------------------
All files  |   87.91 |     87.5 |    87.5 |    87.2 |                                   
 server.js |   87.91 |     87.5 |    87.5 |    87.2 | 48,74,126,185,215,242,252,260-263 
-----------|---------|----------|---------|---------|-----------------------------------
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run specific test types
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:api          # API tests only

# Run tests in watch mode (for development)
npm run test:watch
```

### Test Types

#### 1. **Unit Tests** (`__tests__/unit/`)
Tests individual functions and modules in isolation with mocking.

- **Helper Functions**: Tests for `readBooks()` and `writeBooks()` functions
- **Data Validation**: Tests for input validation logic
- **Error Handling**: Tests for error scenarios and edge cases
- **Mocking**: Uses Jest mocks to isolate functionality

**Example:**
```javascript
describe('readBooks', () => {
  it('should return parsed books data when file exists', async () => {
    const mockBooks = [{ id: '1', title: 'Test Book', author: 'Test Author' }];
    fs.readFile.mockResolvedValue(JSON.stringify(mockBooks));
    
    const result = await readBooks();
    expect(result).toEqual(mockBooks);
  });
});
```

#### 2. **Integration Tests** (`__tests__/integration/`)
Tests the interaction between components and external systems.

- **File System Operations**: Real file system read/write operations
- **Database State Management**: Testing data persistence across operations
- **Error Scenarios**: File corruption, permissions, large datasets
- **Performance Testing**: Tests with 100+ records

**Example:**
```javascript
it('should maintain database state across multiple operations', async () => {
  await writeBooks([book1]);
  let books = await readBooks();
  expect(books).toHaveLength(1);
  
  await writeBooks([book1, book2]);
  books = await readBooks();
  expect(books).toHaveLength(2);
});
```

#### 3. **API Tests** (`__tests__/api/`)
End-to-end tests for all API endpoints using Supertest.

- **CRUD Operations**: Complete testing of Create, Read, Update, Delete
- **Validation Testing**: Required fields, duplicate ISBNs, invalid data
- **Error Responses**: 400, 404, 500 status codes
- **Search Functionality**: Case-insensitive search across fields
- **Edge Cases**: Empty databases, malformed requests

**Example:**
```javascript
describe('POST /api/books', () => {
  it('should create a new book with valid data', async () => {
    const newBook = { title: 'Test Book', author: 'Test Author' };
    
    const response = await request(app)
      .post('/api/books')
      .send(newBook)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(newBook.title);
  });
});
```

### Test Structure

```
__tests__/
├── setup.js                     # Jest configuration and global helpers
├── unit/
│   └── helpers.test.js          # Unit tests for helper functions
├── integration/
│   └── database.integration.test.js  # Database integration tests
└── api/
    └── books.api.test.js        # API endpoint tests
```

### Test Features

- **Test Isolation**: Each test runs independently with fresh data
- **Mocking**: Comprehensive mocking for unit tests
- **Real I/O**: Integration tests use actual file system operations
- **Coverage Thresholds**: Enforced minimum 70% coverage
- **Parallel Execution**: Tests run in parallel for speed
- **Comprehensive Assertions**: Testing success/error cases, edge cases

### Testing Best Practices Implemented

1. **AAA Pattern**: Arrange, Act, Assert structure
2. **Descriptive Test Names**: Clear test descriptions
3. **Test Isolation**: No dependencies between tests
4. **Comprehensive Coverage**: Tests for happy path and error scenarios
5. **Realistic Test Data**: Use of realistic book data and edge cases
6. **Cleanup**: Proper test cleanup to avoid side effects

## 🧪 Manual API Testing

### Using cURL

**Get all books:**
```bash
curl -X GET http://localhost:3000/api/books
```

**Create a new book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "genre": "Fiction",
    "publishedYear": 2024,
    "description": "A test book"
  }'
```

**Update a book:**
```bash
curl -X PUT http://localhost:3000/api/books/BOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "author": "Updated Author"
  }'
```

**Delete a book:**
```bash
curl -X DELETE http://localhost:3000/api/books/BOOK_ID
```

**Search books:**
```bash
curl -X GET http://localhost:3000/api/books/search/fiction
```

### Using the Frontend

1. Navigate to `http://localhost:3000`
2. Use the form to add new books
3. View all books in the grid layout
4. Use the search functionality
5. Edit or delete books using the action buttons

## 📁 Project Structure

```
bookAPI/
├── package.json          # Dependencies and scripts
├── server.js            # Main server file with exported functions for testing
├── books.json           # JSON database file
├── test-books.json      # Test database file (auto-generated during tests)
├── README.md            # Project documentation
├── __tests__/           # Test suite directory
│   ├── setup.js         # Jest setup and global test helpers
│   ├── unit/            # Unit tests
│   │   └── helpers.test.js
│   ├── integration/     # Integration tests
│   │   └── database.integration.test.js
│   └── api/             # API endpoint tests
│       └── books.api.test.js
├── coverage/            # Test coverage reports (generated)
└── public/              # Frontend files
    ├── index.html       # Main HTML file
    ├── style.css        # Stylesheet
    └── script.js        # JavaScript functionality
```

## 🔍 Key Features Explained

### Data Validation
- Title and author are required fields
- ISBN uniqueness is enforced
- Published year must be a valid number
- Input sanitization prevents XSS attacks

### Search Functionality
- Case-insensitive search
- Searches across title, author, and genre fields
- Real-time results display

### User Experience
- Toast notifications for user feedback
- Loading states during API calls
- Responsive design for all screen sizes
- Modal dialogs for editing
- Form validation and error handling

### Security Features
- CORS enabled for cross-origin requests
- Input sanitization
- Error handling that doesn't expose sensitive information

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   Solution: Kill the process using port 3000 or change the port in server.js

2. **Cannot find module**
   ```bash
   Error: Cannot find module 'express'
   ```
   Solution: Run `npm install` to install dependencies

3. **Books not loading**
   - Check if server is running
   - Verify API endpoint URLs
   - Check browser console for errors

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check the `books.json` file to see stored data
- Use browser developer tools to debug frontend issues
- Server logs will show API request details

## 🚀 Deployment

This project can be deployed to various platforms:

### Heroku
1. Create a Heroku app
2. Set the `PORT` environment variable
3. Deploy using Git

### Railway/Render
1. Connect your GitHub repository
2. Set build and start commands
3. Deploy automatically

### Traditional Server
1. Copy files to server
2. Install Node.js and npm
3. Run `npm install` and `npm start`

## ✅ Implemented Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete books
- ✅ **Search Functionality** - Search by title, author, genre
- ✅ **Input Validation** - Server-side validation for data integrity
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **Comprehensive Testing Suite** - 87.9% code coverage with unit, integration, and API tests
- ✅ **RESTful API Design** - Following REST conventions
- ✅ **Responsive Frontend** - Works on desktop, tablet, and mobile devices

## 📝 Future Enhancements

- Add user authentication and authorization
- Implement database (PostgreSQL/MongoDB) instead of JSON file
- Add book cover image uploads with file storage
- Implement pagination for large datasets
- Add advanced sorting and filtering options
- API rate limiting and throttling
- Docker containerization
- CI/CD pipeline integration
- API documentation with Swagger/OpenAPI
- Database migrations and seeding
- Book recommendations system
- Multi-language support

## 🤝 Contributing

This project is part of the Keploy Fellowship. Feel free to fork and enhance it for your own learning!

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Keploy Fellowship** 