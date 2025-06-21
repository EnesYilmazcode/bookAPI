// API Base URL
const API_BASE = '/api/books';

// DOM Elements
const bookForm = document.getElementById('bookForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');
const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const loading = document.getElementById('loading');
const noBooks = document.getElementById('noBooks');
const toast = document.getElementById('toast');

// State
let currentBooks = [];
let editingBookId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submissions
    bookForm.addEventListener('submit', handleAddBook);
    editForm.addEventListener('submit', handleUpdateBook);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Refresh button
    refreshBtn.addEventListener('click', loadBooks);
    

    // Modal controls
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeModal();
        }
    });
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load all books
async function loadBooks() {
    try {
        showLoading(true);
        const response = await apiRequest(API_BASE);
        currentBooks = response.data;
        displayBooks(currentBooks);
        showToast('Books loaded successfully', 'success');
    } catch (error) {
        showToast('Failed to load books: ' + error.message, 'error');
        displayBooks([]);
    } finally {
        showLoading(false);
    }
}

// Display books in the grid
function displayBooks(books) {
    if (books.length === 0) {
        booksContainer.style.display = 'none';
        noBooks.style.display = 'block';
        return;
    }
    
    booksContainer.style.display = 'grid';
    noBooks.style.display = 'none';
    
    booksContainer.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
            ${book.isbn ? `<p><strong>ISBN:</strong> ${escapeHtml(book.isbn)}</p>` : ''}
            <p><strong>Genre:</strong> ${escapeHtml(book.genre || 'Unknown')}</p>
            ${book.publishedYear ? `<p><strong>Published:</strong> ${book.publishedYear}</p>` : ''}
            ${book.description ? `<p class="description">${escapeHtml(book.description)}</p>` : ''}
            
            <div class="book-meta">
                <span>Created: ${formatDate(book.createdAt)}</span>
                ${book.updatedAt !== book.createdAt ? `<span>Updated: ${formatDate(book.updatedAt)}</span>` : ''}
            </div>
            
            <div class="book-actions">
                <button class="btn-edit" onclick="openEditModal('${book.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle adding a new book. This function is called when the user clicks the "Add Book" button.
async function handleAddBook(e) {
    e.preventDefault();
    
    const formData = new FormData(bookForm);
    const bookData = Object.fromEntries(formData.entries());
    
    // Convert publishedYear to number if provided
    if (bookData.publishedYear) {
        bookData.publishedYear = parseInt(bookData.publishedYear);
    }
    
    try {
        await apiRequest(API_BASE, {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
        
        showToast('Book added successfully!', 'success');
        bookForm.reset();
        loadBooks();
    } catch (error) {
        showToast('Failed to add book: ' + error.message, 'error');
    }
}

// Handle updating a book
async function handleUpdateBook(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const bookData = Object.fromEntries(formData.entries());
    
    // Convert publishedYear to number if provided
    if (bookData.publishedYear) {
        bookData.publishedYear = parseInt(bookData.publishedYear);
    }
    
    try {
        await apiRequest(`${API_BASE}/${editingBookId}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
        
        showToast('Book updated successfully!', 'success');
        closeModal();
        loadBooks();
    } catch (error) {
        showToast('Failed to update book: ' + error.message, 'error');
    }
}

// Delete a book
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        await apiRequest(`${API_BASE}/${bookId}`, {
            method: 'DELETE'
        });
        
        showToast('Book deleted successfully!', 'success');
        loadBooks();
    } catch (error) {
        showToast('Failed to delete book: ' + error.message, 'error');
    }
}

// Open edit modal
function openEditModal(bookId) {
    const book = currentBooks.find(b => b.id === bookId);
    if (!book) return;
    
    editingBookId = bookId;
    
    // Populate form fields
    document.getElementById('editId').value = book.id;
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editIsbn').value = book.isbn || '';
    document.getElementById('editGenre').value = book.genre || '';
    document.getElementById('editPublishedYear').value = book.publishedYear || '';
    document.getElementById('editDescription').value = book.description || '';
    
    editModal.style.display = 'block';
}

// Close modal
function closeModal() {
    editModal.style.display = 'none';
    editingBookId = null;
    editForm.reset();
}

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        displayBooks(currentBooks);
        return;
    }
    
    try {
        showLoading(true);
        const response = await apiRequest(`${API_BASE}/search/${encodeURIComponent(query)}`);
        displayBooks(response.data);
        showToast(`Found ${response.count} book(s) matching "${query}"`, 'success');
    } catch (error) {
        showToast('Search failed: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    displayBooks(currentBooks);
    showToast('Search cleared', 'success');
}

// Utility Functions

// Show/hide loading indicator
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    booksContainer.style.display = show ? 'none' : 'grid';
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.deleteBook = deleteBook; 