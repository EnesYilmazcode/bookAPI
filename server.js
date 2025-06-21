const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'books.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


async function readBooks() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write books to JSON file
async function writeBooks(books) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
    } catch (error) {
        throw new Error('Failed to write to database');
    }
}

// API Routes

// GET /api/books - Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await readBooks();
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve books',
            error: error.message
        });
    }
});

// GET /api/books/:id - Get a specific book
app.get('/api/books/:id', async (req, res) => {
    try {
        const books = await readBooks();
        const book = books.find(b => b.id === req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve book',
            error: error.message
        });
    }
});

// POST /api/books - Create a new book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, isbn, genre, publishedYear, description } = req.body;
        
        // Validate required fields
        if (!title || !author) {
            return res.status(400).json({
                success: false,
                message: 'Title and author are required fields'
            });
        }
        
        const books = await readBooks();
        
        // Check if book with same ISBN already exists
        if (isbn && books.some(book => book.isbn === isbn)) {
            return res.status(400).json({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        }
        
        const newBook = {
            id: uuidv4(),
            title,
            author,
            isbn: isbn || null,
            genre: genre || 'Unknown',
            publishedYear: publishedYear || null,
            description: description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        books.push(newBook);
        await writeBooks(books);
        
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create book',
            error: error.message
        });
    }
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', async (req, res) => {
    try {
        const books = await readBooks();
        const bookIndex = books.findIndex(b => b.id === req.params.id);
        
        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        const { title, author, isbn, genre, publishedYear, description } = req.body;
        
        // Validate required fields
        if (!title || !author) {
            return res.status(400).json({
                success: false,
                message: 'Title and author are required fields, please fill in the required fields'
            });
        }
        
        // Check if ISBN is being changed to one that already exists
        if (isbn && isbn !== books[bookIndex].isbn && books.some(book => book.isbn === isbn)) {
            return res.status(400).json({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        }
        
        // Update book
        books[bookIndex] = {
            ...books[bookIndex],
            title,
            author,
            isbn: isbn || null,
            genre: genre || books[bookIndex].genre,
            publishedYear: publishedYear || books[bookIndex].publishedYear,
            description: description || books[bookIndex].description,
            updatedAt: new Date().toISOString()
        };
        
        await writeBooks(books);
        
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: books[bookIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update book',
            error: error.message
        });
    }
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const books = await readBooks();
        const bookIndex = books.findIndex(b => b.id === req.params.id);
        
        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        const deletedBook = books.splice(bookIndex, 1)[0];
        await writeBooks(books);
        
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: deletedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete book',
            error: error.message
        });
    }
});

// GET /api/books/search/:query - Search books by title or author
app.get('/api/books/search/:query', async (req, res) => {
    try {
        const books = await readBooks();
        const query = req.params.query.toLowerCase();
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        );
        
        res.json({
            success: true,
            count: filteredBooks.length,
            query: req.params.query,
            data: filteredBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to search books',
            error: error.message
        });
    }
});

// Root route - serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Book API Server is running on http://localhost:${PORT}`);
    console.log(`📚 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api/books`);
}); 