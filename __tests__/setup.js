// Jest setup file for common test configurations

// Set default test timeout
jest.setTimeout(10000);

// Global test setup
beforeAll(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Suppress console logs during tests (uncomment if needed)
    // console.log = jest.fn();
    // console.error = jest.fn();
    // console.warn = jest.fn();
});

// Global cleanup
afterAll(() => {
    // Clean up environment
    delete process.env.NODE_ENV;
});

// Mock timers globally if needed
// jest.useFakeTimers();

// Global test helpers
global.testHelpers = {
    // Helper to create a valid book object
    createValidBook: (overrides = {}) => ({
        id: 'test-id',
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-0-123456-78-9',
        genre: 'Fiction',
        publishedYear: 2023,
        description: 'A test book',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...overrides
    }),

    // Helper to create minimal book object
    createMinimalBook: (overrides = {}) => ({
        title: 'Minimal Book',
        author: 'Minimal Author',
        ...overrides
    }),

    // Helper to wait for async operations
    wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))
}; 