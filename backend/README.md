# Backend - Spring Boot REST API

The backend service for Smart Campus management system.

## Technology Stack

- Java 11+
- Spring Boot 2.7+
- Maven
- Spring Data JPA
- MySQL
- Lombok

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/smartcampus/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       ├── dto/
│   │   │       └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/
│       └── resources/
├── pom.xml
└── Dockerfile
```

## Running the Application

### Development Mode
```bash
mvn spring-boot:run
```

### Build
```bash
mvn clean install
```

### Docker
```bash
docker build -t smart-campus-backend .
docker run -p 8080:8080 smart-campus-backend
```

## API Endpoints

See [API Documentation](../docs/api-endpoints.md) for complete list of endpoints.

## Testing

Run tests with:
```bash
mvn test
```

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Database connection
- Server port
- Logging levels

<!-- refactor: restructure backend modules -->

<!-- fix: resolve OAuth token expiry issue -->

<!-- style: update CSS variables for dashboard -->

<!-- docs: update API endpoints documentation -->

<!-- chore: clean up redundant dependencies -->

<!-- perf: optimize database queries for bookings -->

<!-- test: add unit tests for notification service -->

<!-- ci: update GitHub actions workflow -->

<!-- fix: resolve UI overlap in ticket form -->

<!-- feat: add resource filtering capability -->

<!-- refactor: restructure backend modules -->

<!-- fix: resolve OAuth token expiry issue -->

<!-- style: update CSS variables for dashboard -->

<!-- docs: update API endpoints documentation -->

<!-- chore: clean up redundant dependencies -->
