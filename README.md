# 📚 Book Library API

A modern, full-stack RESTful API for managing a book collection with CRUD operations, built with Node.js, Express, and vanilla JavaScript frontend.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete books
- **Search Functionality**: Search books by title, author, or genre
- **Modern UI**: Beautiful, responsive frontend interface
- **Data Persistence**: JSON file-based database storage
- **Input Validation**: Server-side validation for data integrity
- **Error Handling**: Comprehensive error handling and user feedback
- **RESTful Design**: Following REST API conventions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

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

## 🧪 Testing the API

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
├── server.js            # Main server file
├── books.json           # JSON database file
├── README.md            # Project documentation
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

## 📝 Future Enhancements

- Add user authentication
- Implement database (PostgreSQL/MongoDB)
- Add book cover image uploads
- Implement pagination for large datasets
- Add sorting and filtering options
- API rate limiting
- Unit and integration tests
- Docker containerization

## 🤝 Contributing

This project is part of the Keploy Fellowship. Feel free to fork and enhance it for your own learning!

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Keploy Fellowship** 