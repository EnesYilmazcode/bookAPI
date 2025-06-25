const fs = require('fs').promises;
const path = require('path');
const { readBooks, writeBooks } = require('../../server');

// Mock fs module
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn()
    }
}));

describe('Helper Functions Unit Tests', () => {
    
    describe('readBooks', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            // Set test environment
            process.env.NODE_ENV = 'test';
        });

        afterEach(() => {
            delete process.env.NODE_ENV;
        });

        it('should return parsed books data when file exists', async () => {
            const mockBooks = [
                {
                    id: '1',
                    title: 'Test Book',
                    author: 'Test Author',
                    genre: 'Fiction'
                }
            ];
            
            fs.readFile.mockResolvedValue(JSON.stringify(mockBooks));

            const result = await readBooks();

            expect(fs.readFile).toHaveBeenCalledWith(
                expect.stringContaining('test-books.json'),
                'utf8'
            );
            expect(result).toEqual(mockBooks);
        });

        it('should return empty array when file does not exist', async () => {
            fs.readFile.mockRejectedValue(new Error('File not found'));

            const result = await readBooks();

            expect(result).toEqual([]);
        });

        it('should return empty array when file contains invalid JSON', async () => {
            fs.readFile.mockResolvedValue('invalid json');

            const result = await readBooks();

            expect(result).toEqual([]);
        });
    });

    describe('writeBooks', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            process.env.NODE_ENV = 'test';
        });

        afterEach(() => {
            delete process.env.NODE_ENV;
        });

        it('should write books data to file successfully', async () => {
            const mockBooks = [
                {
                    id: '1',
                    title: 'Test Book',
                    author: 'Test Author'
                }
            ];

            fs.writeFile.mockResolvedValue();

            await writeBooks(mockBooks);

            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining('test-books.json'),
                JSON.stringify(mockBooks, null, 2)
            );
        });

        it('should throw error when write fails', async () => {
            const mockBooks = [{ id: '1', title: 'Test' }];
            
            fs.writeFile.mockRejectedValue(new Error('Write failed'));

            await expect(writeBooks(mockBooks)).rejects.toThrow('Failed to write to database');
        });
    });
}); 