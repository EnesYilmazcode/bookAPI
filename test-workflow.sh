#!/bin/bash

# Test script to verify the GitHub Actions workflow will work
# This simulates the workflow steps locally

echo "🚀 Testing Book API Workflow Simulation"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Step 1: Check dependencies
print_info "Step 1: Checking dependencies..."
command -v node >/dev/null 2>&1
print_status "Node.js is installed" $?

command -v npm >/dev/null 2>&1
print_status "npm is installed" $?

# Step 2: Install project dependencies
print_info "Step 2: Installing project dependencies..."
npm ci > /dev/null 2>&1
print_status "Dependencies installed" $?

# Step 3: Create test environment
print_info "Step 3: Setting up test environment..."
cp books.json test-books.json
print_status "Test data file created" $?

# Step 4: Start server in background
print_info "Step 4: Starting API server..."
NODE_ENV=test npm start > server.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Step 5: Wait for server to be ready
print_info "Step 5: Waiting for server to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:3000/api/books > /dev/null 2>&1; then
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Server logs:"
        cat server.log
        print_status "Server ready" 1
    fi
    sleep 1
done
print_status "Server is ready" 0

# Step 6: Test all API endpoints
print_info "Step 6: Testing API endpoints..."

# Test GET /api/books
print_info "Testing GET /api/books"
curl -s -f http://localhost:3000/api/books > /dev/null
print_status "GET /api/books" $?

# Test POST /api/books
print_info "Testing POST /api/books"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Book", "author": "Test Author", "genre": "Test"}')
echo "$RESPONSE" | grep -q '"success":true'
POST_STATUS=$?
print_status "POST /api/books" $POST_STATUS

if [ $POST_STATUS -eq 0 ]; then
    BOOK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Created book with ID: $BOOK_ID"
    
    # Test GET /api/books/{id}
    print_info "Testing GET /api/books/{id}"
    curl -s -f http://localhost:3000/api/books/$BOOK_ID > /dev/null
    print_status "GET /api/books/{id}" $?
    
    # Test PUT /api/books/{id}
    print_info "Testing PUT /api/books/{id}"
    curl -s -X PUT http://localhost:3000/api/books/$BOOK_ID \
      -H "Content-Type: application/json" \
      -d '{"title": "Updated Test Book", "author": "Test Author", "genre": "Updated"}' > /dev/null
    print_status "PUT /api/books/{id}" $?
    
    # Test DELETE /api/books/{id}
    print_info "Testing DELETE /api/books/{id}"
    curl -s -X DELETE http://localhost:3000/api/books/$BOOK_ID > /dev/null
    print_status "DELETE /api/books/{id}" $?
fi

# Test GET /api/books/search/{query}
print_info "Testing GET /api/books/search/{query}"
curl -s -f http://localhost:3000/api/books/search/gatsby > /dev/null
print_status "GET /api/books/search/{query}" $?

# Step 7: Test error scenarios
print_info "Step 7: Testing error scenarios..."

# Test 400 error
print_info "Testing 400 Bad Request"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Missing Author"}')
if [ "$HTTP_CODE" = "400" ]; then
    print_status "400 Bad Request test" 0
else
    print_status "400 Bad Request test (got $HTTP_CODE)" 1
fi

# Test 404 error
print_info "Testing 404 Not Found"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:3000/api/books/non-existent-id)
if [ "$HTTP_CODE" = "404" ]; then
    print_status "404 Not Found test" 0
else
    print_status "404 Not Found test (got $HTTP_CODE)" 1
fi

# Step 8: Verify response format
print_info "Step 8: Verifying response formats..."

RESPONSE=$(curl -s http://localhost:3000/api/books)
echo "$RESPONSE" | grep -q '"success":true'
print_status "Response contains success field" $?

echo "$RESPONSE" | grep -q '"data":\['
print_status "Response contains data array" $?

echo "$RESPONSE" | grep -q '"count":'
print_status "Response contains count field" $?

# Step 9: Performance test
print_info "Step 9: Running performance test..."
start_time=$(date +%s%N)
for i in {1..10}; do
    curl -s http://localhost:3000/api/books > /dev/null
done
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
echo "10 requests completed in ${duration}ms"
if [ $duration -lt 5000 ]; then
    print_status "Performance test (under 5 seconds)" 0
else
    print_status "Performance test (over 5 seconds)" 1
fi

# Cleanup
print_info "Cleaning up..."
kill $SERVER_PID 2>/dev/null || true
rm -f test-books.json server.log

echo ""
echo "🎉 Workflow simulation completed successfully!"
echo ""
echo "Summary:"
echo "✅ All API endpoints are working"
echo "✅ Error handling is correct"
echo "✅ Response formats are valid"
echo "✅ Performance is acceptable"
echo ""
echo "The GitHub Actions workflow should pass successfully! 🚀" 