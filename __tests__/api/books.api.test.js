const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const { app } = require('../../server');

const TEST_DATA_FILE = path.join(__dirname, '../../test-books.json');

describe('Books API Tests', () => {
    let testBooks;

    beforeEach(async () => {
        // Set test environment
        process.env.NODE_ENV = 'test';
        
        // Clean up any existing test file first
        try {
            await fs.unlink(TEST_DATA_FILE);
        } catch (error) {
            // File might not exist, ignore
        }
        
        // Initialize test data
        testBooks = [
            {
                id: 'test-id-1',
                title: 'Test Book 1',
                author: 'Test Author 1',
                isbn: '978-0-123456-78-9',
                genre: 'Fiction',
                publishedYear: 2020,
                description: 'A test book for testing purposes',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: 'test-id-2',
                title: 'Test Book 2',
                author: 'Test Author 2',
                isbn: '978-0-987654-32-1',
                genre: 'Non-Fiction',
                publishedYear: 2021,
                description: 'Another test book',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            }
        ];

        // Write test data to file
        await fs.writeFile(TEST_DATA_FILE, JSON.stringify(testBooks, null, 2));
        
        // Wait a bit to ensure file is written
        await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(async () => {
        // Clean up test file
        try {
            await fs.unlink(TEST_DATA_FILE);
        } catch (error) {
            // File might not exist, ignore
        }
        delete process.env.NODE_ENV;
    });

    describe('GET /api/books', () => {
        it('should return all books with success response', async () => {
            const response = await request(app)
                .get('/api/books')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                count: 2,
                data: testBooks
            });
        });

        it('should return empty array when no books exist', async () => {
            await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));

            const response = await request(app)
                .get('/api/books')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                count: 0,
                data: []
            });
        });
    });

    describe('GET /api/books/:id', () => {
        it('should return a specific book when valid ID is provided', async () => {
            const response = await request(app)
                .get('/api/books/test-id-1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: testBooks[0]
            });
        });

        it('should return 404 when book ID does not exist', async () => {
            const response = await request(app)
                .get('/api/books/non-existent-id')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Book not found'
            });
        });
    });

    describe('POST /api/books', () => {
        it('should create a new book with valid data', async () => {
            const newBook = {
                title: 'New Test Book',
                author: 'New Test Author',
                isbn: '978-0-111111-11-1',
                genre: 'Science Fiction',
                publishedYear: 2023,
                description: 'A brand new test book'
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Book created successfully');
            expect(response.body.data).toMatchObject({
                title: newBook.title,
                author: newBook.author,
                isbn: newBook.isbn,
                genre: newBook.genre,
                publishedYear: newBook.publishedYear,
                description: newBook.description
            });
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.createdAt).toBeDefined();
            expect(response.body.data.updatedAt).toBeDefined();
        });

        it('should create a book with minimal required fields', async () => {
            const newBook = {
                title: 'Minimal Book',
                author: 'Minimal Author'
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                title: newBook.title,
                author: newBook.author,
                isbn: null,
                genre: 'Unknown',
                publishedYear: null,
                description: ''
            });
        });

        it('should return 400 when title is missing', async () => {
            const newBook = {
                author: 'Test Author'
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Title and author are required fields'
            });
        });

        it('should return 400 when author is missing', async () => {
            const newBook = {
                title: 'Test Title'
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Title and author are required fields'
            });
        });

        it('should return 400 when ISBN already exists', async () => {
            // First, make sure our test data is properly set up
            const booksCheck = await request(app).get('/api/books');
            expect(booksCheck.body.count).toBeGreaterThan(0);
            
            const newBook = {
                title: 'Duplicate ISBN Book',
                author: 'Test Author',
                isbn: '978-0-123456-78-9' // Same as test-id-1
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        });
    });

    describe('PUT /api/books/:id', () => {
        it('should update an existing book', async () => {
            const updatedBook = {
                title: 'Updated Test Book',
                author: 'Updated Test Author',
                isbn: '978-0-123456-78-9',
                genre: 'Updated Fiction',
                publishedYear: 2022,
                description: 'An updated test book'
            };

            const response = await request(app)
                .put('/api/books/test-id-1')
                .send(updatedBook)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Book updated successfully');
            expect(response.body.data).toMatchObject({
                id: 'test-id-1',
                title: updatedBook.title,
                author: updatedBook.author,
                isbn: updatedBook.isbn,
                genre: updatedBook.genre,
                publishedYear: updatedBook.publishedYear,
                description: updatedBook.description
            });
            expect(response.body.data.updatedAt).not.toBe(testBooks[0].updatedAt);
        });

        it('should return 404 when updating non-existent book', async () => {
            const updatedBook = {
                title: 'Updated Book',
                author: 'Updated Author'
            };

            const response = await request(app)
                .put('/api/books/non-existent-id')
                .send(updatedBook)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Book not found'
            });
        });

        it('should return 400 when required fields are missing in update', async () => {
            const updatedBook = {
                title: 'Updated Title'
                // Missing author
            };

            const response = await request(app)
                .put('/api/books/test-id-1')
                .send(updatedBook)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Title and author are required fields, please fill in the required fields'
            });
        });

        it('should return 400 when updating to existing ISBN', async () => {
            const updatedBook = {
                title: 'Updated Book',
                author: 'Updated Author',
                isbn: '978-0-987654-32-1' // ISBN of test-id-2
            };

            const response = await request(app)
                .put('/api/books/test-id-1')
                .send(updatedBook)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('should delete an existing book', async () => {
            const response = await request(app)
                .delete('/api/books/test-id-1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Book deleted successfully');
            expect(response.body.data).toEqual(testBooks[0]);

            // Verify book is actually deleted
            const getResponse = await request(app)
                .get('/api/books/test-id-1')
                .expect(404);
        });

        it('should return 404 when deleting non-existent book', async () => {
            const response = await request(app)
                .delete('/api/books/non-existent-id')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Book not found'
            });
        });
    });

    describe('GET /api/books/search/:query', () => {
        it('should search books by title', async () => {
            const response = await request(app)
                .get('/api/books/search/Test Book 1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                count: 1,
                query: 'Test Book 1',
                data: [testBooks[0]]
            });
        });

        it('should search books by author', async () => {
            const response = await request(app)
                .get('/api/books/search/Test Author 2')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                count: 1,
                query: 'Test Author 2',
                data: [testBooks[1]]
            });
        });

        it('should search books by genre', async () => {
            const response = await request(app)
                .get('/api/books/search/Fiction')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(2); // Both books match "Fiction"
            expect(response.body.query).toBe('Fiction');
        });

        it('should return empty results for non-matching search', async () => {
            const response = await request(app)
                .get('/api/books/search/NonExistentQuery')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                count: 0,
                query: 'NonExistentQuery',
                data: []
            });
        });

        it('should perform case-insensitive search', async () => {
            const response = await request(app)
                .get('/api/books/search/test author 1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].author).toBe('Test Author 1');
        });
    });

    describe('GET /', () => {
        it('should serve the frontend HTML file', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.headers['content-type']).toMatch(/html/);
        });
    });
}); 