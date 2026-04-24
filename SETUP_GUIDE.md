# Smart Campus - Project Setup Guide

## Overview

This is a full-stack Smart Campus Management System developed for IT3030 PAF 2026 assignment.

**Group**: Y3S1-WE_38  
**Date**: April 2026

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Spring Boot 2.7+, Java 11 |
| Frontend | React 18, Node.js 16+ |
| Database | MySQL 8.0 |
| Build Tool (Backend) | Maven |
| Build Tool (Frontend) | npm |
| Containerization | Docker & Docker Compose |
| CI/CD | GitHub Actions |
| Testing | JUnit 5, Jest |
| API Testing | Postman |

## Prerequisites

### Required Software
- **Java**: OpenJDK 11 or higher
- **Node.js**: 14.x or higher (includes npm)
- **Maven**: 3.6.0 or higher
- **Docker**: 20.10+ (optional, for containerized setup)
- **Git**: Latest version

### Verify Installation

```bash
# Check Java
java -version

# Check Node.js and npm
node --version
npm --version

# Check Maven
mvn --version

# Check Docker (if using)
docker --version
docker-compose --version
```

## Project Structure

```
smart-campus/
├── README.md                 # Main project README
├── docker-compose.yml        # Docker Compose configuration
├── .gitignore               # Git ignore rules
│
├── backend/                 # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartcampus/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   ├── repository/    # Data Access
│   │   │   │   ├── model/         # Entity Models
│   │   │   │   ├── dto/           # DTOs
│   │   │   │   └── SmartCampusApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── frontend/                # React Web Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services
│   │   ├── styles/         # CSS Styles
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── docs/                    # Documentation
│   ├── api-endpoints.md    # API Documentation
│   ├── database-design.sql # Database Schema
│   ├── architecture-diagram.png
│   ├── testing-evidence/   # Test Results
│   └── report.pdf
│
├── postman/                 # API Testing
│   └── collection.json     # Postman Collection
│
└── .github/
    └── workflows/
        └── ci.yml          # GitHub Actions CI/CD
```

## Getting Started

### Option 1: Local Development Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure database (update `src/main/resources/application.properties`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
spring.datasource.username=root
spring.datasource.password=root
```

3. Create database:
```bash
mysql -u root -p < ../docs/database-design.sql
```

4. Build the project:
```bash
mvn clean install
```

5. Run the application:
```bash
mvn spring-boot:run
```

Backend API will be available at: `http://localhost:8080/api`

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

#### Database Setup (Standalone)

1. Start MySQL service
2. Run SQL schema:
```bash
mysql -u root -p < docs/database-design.sql
```

### Option 2: Docker Setup

This is the easiest way to run the entire application stack.

1. Ensure Docker and Docker Compose are installed

2. From project root, run:
```bash
docker-compose up -d
```

3. Services will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - MySQL: localhost:3306

To stop services:
```bash
docker-compose down
```

## API Documentation

See [API Endpoints](./docs/api-endpoints.md) for complete list of available endpoints.

### Quick API Test

1. **Login**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@smartcampus.edu", "password": "password123"}'
```

2. **Get Dashboard Stats**:
```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

3. **Using Postman**:
   - Import `postman/collection.json` into Postman
   - Configure variables (baseUrl, token)
   - Run requests

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
- Use Postman collection for API testing
- See [Testing Evidence](./docs/testing-evidence/) for results

## Build & Deployment

### Build JAR (Backend)
```bash
cd backend
mvn clean package
```

Output: `backend/target/smart-campus-backend-1.0.0.jar`

### Build Production Frontend
```bash
cd frontend
npm run build
```

Output: `frontend/build/` directory

### Build Docker Images
```bash
docker build -t smart-campus-backend:latest ./backend
docker build -t smart-campus-frontend:latest ./frontend
```

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. **On every push to main/develop**:
   - Builds backend with Maven
   - Runs backend unit tests
   - Builds frontend with npm
   - Runs frontend tests
   - Performs security scanning
   - Builds Docker images (for main branch)

2. **Monitors**:
   - Code quality (optional SonarCloud integration)
   - Security vulnerabilities (Trivy scanner)
   - Test coverage

## Environment Variables

### Backend (.env or application.properties)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_campus
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=your-secret-key
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

## Common Commands

| Task | Command |
|------|---------|
| Start backend | `cd backend && mvn spring-boot:run` |
| Start frontend | `cd frontend && npm start` |
| Run all tests | `cd backend && mvn test && cd ../frontend && npm test` |
| Build for production | `cd backend && mvn package && cd ../frontend && npm run build` |
| Docker compose up | `docker-compose up -d` |
| Docker compose down | `docker-compose down` |
| View backend logs | `cd backend && tail -f target/app.log` |
| Frontend lint | `cd frontend && npm run lint` |

## Troubleshooting

### Port Already in Use
- Backend (8080): `lsof -i :8080` or `netstat -tlnp | grep 8080`
- Frontend (3000): `lsof -i :3000` or `netstat -tlnp | grep 3000`

### Database Connection Error
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database exists

### Frontend Can't Connect to Backend
- Verify backend is running on port 8080
- Check `REACT_APP_API_URL` environment variable
- Check CORS configuration in Spring Boot

### Build Failures
- Clear cache: `mvn clean` or `rm -rf node_modules`
- Update dependencies: `mvn clean install` or `npm install`

## Documentation Files

- [API Documentation](./docs/api-endpoints.md) - Complete API reference
- [Database Schema](./docs/database-design.sql) - Database design
- [Testing Evidence](./docs/testing-evidence/) - Test results
- [Backend README](./backend/README.md) - Backend specific info
- [Frontend README](./frontend/README.md) - Frontend specific info

## Team Information

- **Group**: Y3S1-WE_38
- **Assignment**: IT3030 PAF 2026
- **University**: (Your University Name)

## License

(Add appropriate license information)

## Support

For issues or questions, please:
1. Check the documentation
2. Review existing issues on GitHub
3. Create a new issue with details

---

**Last Updated**: April 21, 2026
