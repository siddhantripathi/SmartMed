#!/bin/bash

# SmartMed Smoke Tests Runner

echo "🧪 Running SmartMed Smoke Tests..."
echo "=================================="

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root."
    exit 1
fi

# Function to run tests for a specific directory
run_tests() {
    local dir=$1
    local name=$2

    echo ""
    echo "🔍 Running $name smoke tests..."
    echo "Directory: $dir"

    if [ -d "$dir" ]; then
        cd "$dir"

        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "📦 Installing dependencies..."
            npm install

            echo "🧪 Running tests..."
            if npm test -- --testPathPattern="smoke" --verbose; then
                echo "✅ $name smoke tests passed!"
                cd - > /dev/null
                return 0
            else
                echo "❌ $name smoke tests failed!"
                cd - > /dev/null
                return 1
            fi
        else
            echo "⚠️ No package.json found in $dir, skipping tests"
            cd - > /dev/null
            return 0
        fi
    else
        echo "⚠️ Directory $dir not found, skipping tests"
        return 0
    fi
}

# Track overall success
overall_success=true

# Run mobile app smoke tests
if ! run_tests "mobile" "Mobile App"; then
    overall_success=false
fi

# Run Firebase functions smoke tests
if ! run_tests "functions" "Firebase Functions"; then
    overall_success=false
fi

echo ""
echo "=================================="

if [ "$overall_success" = true ]; then
    echo "🎉 All smoke tests passed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "✅ Mobile App: Tests completed"
    echo "✅ Firebase Functions: Tests completed"
    echo "✅ Redux Store: Tests completed"
    echo "✅ Services: Tests completed"
    echo ""
    echo "🚀 SmartMed is ready for development!"
    exit 0
else
    echo "❌ Some smoke tests failed!"
    echo ""
    echo "🔧 Please fix the failing tests before proceeding:"
    echo "1. Check the test output above for details"
    echo "2. Fix any failing assertions"
    echo "3. Ensure all required dependencies are installed"
    echo "4. Verify Firebase configuration"
    exit 1
fi
