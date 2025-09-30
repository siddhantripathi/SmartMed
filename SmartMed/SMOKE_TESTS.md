# SmartMed Smoke Tests

This document describes the smoke tests for the SmartMed application, ensuring that critical functionality works correctly before proceeding with development.

## Overview

Smoke tests are high-level tests that verify the basic functionality of the application is working without going into deep functional testing. These tests are designed to catch major issues early in the development process.

## Test Categories

### 1. Mobile App Smoke Tests (`mobile/__tests__/App.smoke.test.tsx`)

Tests the core React Native application functionality:

- ✅ **App Initialization**: Verifies the app renders without crashing
- ✅ **Redux Store Setup**: Ensures all Redux slices are properly initialized
- ✅ **Firebase Integration**: Tests that Firebase services initialize correctly
- ✅ **Authentication Flow**: Validates state management for login/logout
- ✅ **Navigation Structure**: Confirms navigation types are properly defined
- ✅ **Medication Management**: Tests Redux state for medication operations

### 2. Redux Store Smoke Tests (`mobile/__tests__/store.smoke.test.ts`)

Comprehensive tests for Redux state management:

- ✅ **Store Initialization**: Verifies all slices are properly set up
- ✅ **User State Management**: Tests login, profile updates, and logout
- ✅ **Medication CRUD**: Tests add, update, delete operations for medications
- ✅ **Supplement Management**: Tests supplement state operations
- ✅ **Interaction Tracking**: Validates interaction state management
- ✅ **Alert System**: Tests alert creation, reading, and acknowledgment
- ✅ **OCR State**: Verifies OCR session management
- ✅ **Error Handling**: Ensures error states are properly managed

### 3. Firebase Functions Smoke Tests (`functions/__tests__/functions.smoke.test.ts`)

Tests the backend Firebase Cloud Functions:

- ✅ **Admin SDK Setup**: Verifies Firebase Admin SDK initializes correctly
- ✅ **Function Exports**: Ensures all expected functions are exported
- ✅ **Type Definitions**: Validates TypeScript type definitions
- ✅ **Controller Functions**: Tests user and medication controllers
- ✅ **Error Handling**: Confirms proper error handling in functions
- ✅ **Test Environment**: Validates firebase-functions-test setup

### 4. Service Integration Smoke Tests (`mobile/__tests__/services.smoke.test.ts`)

Tests service layer integration:

- ✅ **AuthService**: Validates authentication service initialization and methods
- ✅ **FirestoreService**: Tests Firestore service setup and operations
- ✅ **Service Methods**: Ensures all service methods are callable
- ✅ **Error Handling**: Verifies graceful error handling
- ✅ **Configuration**: Tests Firebase configuration setup
- ✅ **State Consistency**: Ensures services maintain consistent state

## Running Smoke Tests

### Quick Run (All Tests)

```bash
# From project root
./scripts/run-smoke-tests.sh
```

### Individual Test Categories

#### Mobile App Tests
```bash
cd mobile
npm run test:smoke
```

#### Firebase Functions Tests
```bash
cd functions
npm test -- --testPathPattern=smoke
```

### Manual Testing

You can also run specific test files:

```bash
# Mobile app tests
cd mobile
npx jest __tests__/App.smoke.test.tsx --verbose
npx jest __tests__/store.smoke.test.tsx --verbose
npx jest __tests__/services.smoke.test.tsx --verbose

# Firebase functions tests
cd functions
npx jest __tests__/functions.smoke.test.ts --verbose
```

## Test Configuration

### Jest Configuration (`mobile/jest.config.js`)

- **Preset**: `react-native` for React Native testing
- **Setup File**: `mobile/__tests__/setup.ts` for test environment setup
- **Test Pattern**: Looks for `.smoke.test.` files
- **Coverage**: Configured for code coverage reporting
- **Timeout**: 10 seconds per test
- **Verbose Output**: Detailed test output for debugging

### Test Setup (`mobile/__tests__/setup.ts`)

- **React Native Gesture Handler**: Jest setup for gesture handling
- **AsyncStorage**: Mock for persistent storage
- **Permissions**: Mock for camera and other permissions
- **Image Picker**: Mock for camera functionality
- **File System**: Mock for file operations
- **Vector Icons**: Mock for icon components
- **Firebase**: Comprehensive Firebase module mocking

## Test Coverage Areas

### Critical Paths Tested

1. **App Launch**: App initializes without crashing
2. **Authentication**: Login/logout state management
3. **Data Management**: CRUD operations for medications and supplements
4. **Real-time Updates**: Firestore listener setup
5. **Error Handling**: Proper error states and recovery
6. **Navigation**: Screen navigation structure
7. **State Management**: Redux store operations
8. **Service Integration**: Firebase service connectivity

### What These Tests Verify

- ✅ **No Runtime Errors**: App doesn't crash on startup
- ✅ **Redux Store Works**: State management functions correctly
- ✅ **Firebase Connects**: Services initialize and connect properly
- ✅ **Authentication Flows**: Login/logout operations work
- ✅ **CRUD Operations**: Create, read, update, delete functionality
- ✅ **Error Boundaries**: Proper error handling and user feedback
- ✅ **Navigation Structure**: App navigation is properly configured
- ✅ **Service Integration**: Backend services are accessible

## Interpreting Test Results

### Success Indicators

- ✅ All tests pass with green checkmarks
- ✅ No console errors or warnings
- ✅ Proper test coverage of critical paths
- ✅ Fast execution time (smoke tests should be quick)

### Common Failure Scenarios

- ❌ **Module Import Errors**: Missing dependencies or incorrect imports
- ❌ **Redux State Issues**: Improper slice configuration
- ❌ **Firebase Config Errors**: Missing or invalid Firebase configuration
- ❌ **TypeScript Errors**: Type mismatches or missing types
- ❌ **Mock Setup Issues**: Incorrect or incomplete mocking

### Debugging Failed Tests

1. **Check Console Output**: Look for error messages and stack traces
2. **Verify Dependencies**: Ensure all required packages are installed
3. **Check Configuration**: Validate Firebase and other service configs
4. **Review Mock Setup**: Ensure mocks are properly configured
5. **Test Individual Components**: Isolate failing tests to specific areas

## Continuous Integration

These smoke tests should be run:

- ✅ **Pre-deployment**: Before any production deployment
- ✅ **Post-dependency Updates**: After major package updates
- ✅ **CI/CD Pipeline**: As part of automated testing pipeline
- ✅ **Development Milestones**: Before starting new feature development

## Maintenance

### Adding New Smoke Tests

When adding new functionality:

1. **Identify Critical Paths**: Determine what must work for the feature
2. **Add Test Coverage**: Create smoke tests for new critical functionality
3. **Update This Document**: Document new test categories
4. **Run Test Suite**: Ensure new tests pass with existing code

### Test Environment Updates

- **Node.js Version**: Keep Node.js version consistent across environments
- **Dependencies**: Update test dependencies regularly
- **Firebase Emulators**: Ensure emulator versions match production
- **Mock Libraries**: Update mocks for new React Native versions

## Troubleshooting

### Common Issues and Solutions

#### "Module not found" Errors
```bash
# Solution: Install missing dependencies
npm install
cd mobile && npm install
cd functions && npm install
```

#### Firebase Connection Issues
```bash
# Solution: Check Firebase configuration
firebase emulators:start --only firestore,auth,functions
```

#### Redux State Issues
```bash
# Solution: Check store configuration and slice exports
# Verify all slices are properly imported in store/index.ts
```

#### Jest Configuration Problems
```bash
# Solution: Check jest.config.js and setup.ts files
# Ensure proper mocking for React Native modules
```

### Getting Help

If smoke tests consistently fail:

1. **Check Error Logs**: Review detailed error output
2. **Verify Environment**: Ensure development environment matches requirements
3. **Compare with Working Version**: Check if tests worked before recent changes
4. **Community Resources**: Check React Native and Firebase documentation

## Conclusion

These smoke tests provide a comprehensive safety net for the SmartMed application, ensuring that:

- **Core functionality works** before deeper testing
- **Critical paths are validated** early in development
- **Integration points function** correctly
- **No major regressions** are introduced

Run these tests regularly during development to catch issues early and maintain application stability.

---

*Last Updated: $(date)*
*Test Coverage: 4 test suites, 40+ individual tests*
*Execution Time: < 30 seconds*
