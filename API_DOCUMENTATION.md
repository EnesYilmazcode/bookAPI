# Book API - OpenAPI 3.0 Documentation

This project includes comprehensive OpenAPI 3.0 schemas that document all REST API endpoints for the Book Management system.

## Available Schema Files

- **`openapi.yaml`** - OpenAPI 3.0 schema in YAML format
- **`openapi.json`** - OpenAPI 3.0 schema in JSON format

Both files contain identical API documentation in different formats to support various tools and workflows.

## API Overview

The Book API provides a RESTful interface for managing books with full CRUD operations and search functionality.

### Base Information
- **API Name**: Book API
- **Version**: 1.0.0
- **Description**: A RESTful API for managing books with CRUD operations
- **License**: MIT

### Servers
- **Development**: `http://localhost:3000`
- **Production**: `https://your-production-url.com` (update as needed)

## API Endpoints

### Books Collection

#### GET `/api/books`
Retrieve all books in the database.

**Response**: 
- `200 OK` - Returns array of books with count
- `500 Internal Server Error` - Server error

**Example Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "The Lord of the Rings",
      "author": "J.R.R. Tolkien",
      "isbn": "978-0-547-92822-7",
      "genre": "Fantasy",
      "publishedYear": 1954,
      "description": "An epic fantasy novel...",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ]
}
```

#### POST `/api/books`
Create a new book.

**Request Body** (JSON):
```json
{
  "title": "Book Title",        // Required
  "author": "Author Name",      // Required
  "isbn": "978-0-123-45678-9",  // Optional, must be unique
  "genre": "Genre",             // Optional, defaults to "Unknown"
  "publishedYear": 2023,        // Optional
  "description": "Book description" // Optional
}
```

**Responses**:
- `201 Created` - Book created successfully
- `400 Bad Request` - Validation errors (missing required fields, duplicate ISBN)
- `500 Internal Server Error` - Server error

### Individual Book Operations

#### GET `/api/books/{id}`
Retrieve a specific book by its ID.

**Parameters**:
- `id` (path, required) - UUID of the book

**Responses**:
- `200 OK` - Returns the book data
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

#### PUT `/api/books/{id}`
Update an existing book.

**Parameters**:
- `id` (path, required) - UUID of the book

**Request Body**: Same as POST (all fields optional except title and author)

**Responses**:
- `200 OK` - Book updated successfully
- `400 Bad Request` - Validation errors
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

#### DELETE `/api/books/{id}`
Delete a book by its ID.

**Parameters**:
- `id` (path, required) - UUID of the book

**Responses**:
- `200 OK` - Book deleted successfully (returns deleted book data)
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

### Search

#### GET `/api/books/search/{query}`
Search for books by title, author, or genre.

**Parameters**:
- `query` (path, required) - Search term to match against book fields

**Responses**:
- `200 OK` - Returns matching books with search metadata
- `500 Internal Server Error` - Server error

**Example Response**:
```json
{
  "success": true,
  "count": 2,
  "query": "tolkien",
  "data": [
    // Array of matching books
  ]
}
```

## Data Models

### Book Schema
Complete book object with all properties:

```json
{
  "id": "string (uuid)",           // Auto-generated UUID
  "title": "string",               // Required
  "author": "string",              // Required  
  "isbn": "string | null",         // Optional, validated format
  "genre": "string",               // Default: "Unknown"
  "publishedYear": "number | null", // Optional, 1-2024 range
  "description": "string",         // Optional
  "createdAt": "string (ISO date)", // Auto-generated
  "updatedAt": "string (ISO date)"  // Auto-updated
}
```

### BookInput Schema
Input schema for creating/updating books:

```json
{
  "title": "string",        // Required, 1-255 chars
  "author": "string",       // Required, 1-255 chars
  "isbn": "string",         // Optional, validated ISBN format
  "genre": "string",        // Optional, max 100 chars
  "publishedYear": "number", // Optional, 1-2024 range
  "description": "string"   // Optional, max 1000 chars
}
```

### ErrorResponse Schema
Standard error response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details" // Optional
}
```

## Validation Rules

### Required Fields
- `title` and `author` are required for all create/update operations

### ISBN Validation
- Must follow standard ISBN-10 or ISBN-13 format
- Must be unique across all books
- Regex pattern validates proper ISBN structure

### Field Constraints
- **title**: 1-255 characters
- **author**: 1-255 characters  
- **genre**: max 100 characters
- **publishedYear**: integer between 1 and 2024
- **description**: max 1000 characters

## Using the OpenAPI Schemas

### 1. API Documentation Tools
Load the schema files into tools like:
- **Swagger UI**: Visual API documentation
- **Postman**: Import for testing and collection management
- **Insomnia**: API client with schema validation
- **Redoc**: Alternative documentation generator

### 2. Code Generation
Generate client libraries and server stubs:
```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate JavaScript client
openapi-generator-cli generate -i openapi.yaml -g javascript -o ./client

# Generate TypeScript client  
openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o ./client-ts
```

### 3. Validation and Testing
- Use schema for request/response validation
- Generate mock servers for testing
- Validate API compliance

### 4. Integration with Development Tools
Many IDEs and editors support OpenAPI schemas for:
- Auto-completion
- Request validation
- Documentation generation
- API testing

## Next Steps

1. **Update Production URL**: Replace `https://your-production-url.com` with your actual production server URL
2. **API Versioning**: Consider adding version prefix to paths (e.g., `/v1/api/books`)
3. **Authentication**: Add security schemes if authentication is implemented
4. **Rate Limiting**: Document any rate limiting policies
5. **Pagination**: Add pagination parameters for large collections if needed

## Tools and Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/) - Online schema editor
- [OpenAPI Generator](https://openapi-generator.tech/) - Code generation tools
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive documentation 