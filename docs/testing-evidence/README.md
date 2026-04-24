# Testing Evidence

This directory contains all testing evidence and reports for the Smart Campus application.

## Contents

- **Unit Tests**: Test results from JUnit and Jest
- **Integration Tests**: Results from API integration testing
- **E2E Tests**: End-to-end testing evidence
- **Performance Tests**: Load and stress testing results
- **Security Tests**: Security scanning and vulnerability assessment results
- **Test Coverage Reports**: Code coverage metrics

## Test Execution Steps

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### API Integration Tests
Import the Postman collection into Postman and run the test suite.

## Continuous Testing

All tests are automatically executed via GitHub Actions on:
- Push to main/develop branches
- Pull requests

See CI results in the GitHub Actions tab.
