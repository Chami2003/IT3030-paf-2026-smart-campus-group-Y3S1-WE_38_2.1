# Smart Campus - IT3030 PAF 2026

A comprehensive Smart Campus management system built with Spring Boot backend and React frontend.

## Project Overview

This project aims to create an intelligent campus management system that streamlines campus operations, including student management, facility booking, event scheduling, and resource optimization.

## Technology Stack

- **Backend**: Spring Boot (Java)
- **Frontend**: React (JavaScript/TypeScript)
- **Database**: (Configure as needed)
- **DevOps**: Docker, GitHub Actions
- **Testing**: JUnit, Jest

## Project Structure

```
├── backend/          - Spring Boot REST API
├── frontend/         - React web application
├── docs/             - Documentation and diagrams
├── postman/          - API testing collection
└── .github/          - CI/CD workflows
```

## Getting Started

### Prerequisites
- Java 11+ (for backend)
- Node.js 14+ (for frontend)
- Docker and Docker Compose (optional)

### Quick Start

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Documentation

- [API Endpoints](./docs/api-endpoints.md)
- [Database Design](./docs/database-design.sql)
- [Architecture Diagram](./docs/architecture-diagram.png)

## Testing

All tests are automated via GitHub Actions. See [CI Configuration](./.github/workflows/ci.yml)

## Team

Group: Y3S1-WE_38
Assignment: IT3030 PAF 2026

## License

(Add appropriate license)
