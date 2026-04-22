# API Endpoints Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All endpoints (except login) require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
- **Endpoint**: `POST /auth/login`
- **Description**: User login
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "userId": 1,
    "role": "STUDENT"
  }
  ```

### Register
- **Endpoint**: `POST /auth/register`
- **Description**: User registration
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT"
  }
  ```

---

## User Endpoints

### Get User Profile
- **Endpoint**: `GET /users/{id}`
- **Description**: Retrieve user profile
- **Response**: User object

### Update User Profile
- **Endpoint**: `PUT /users/{id}`
- **Description**: Update user information
- **Request Body**: User object with updates

### Get All Users
- **Endpoint**: `GET /users`
- **Description**: List all users (Admin only)
- **Query Parameters**:
  - `page`: Page number (default: 0)
  - `size`: Page size (default: 20)

---

## Facility Endpoints

### Get All Facilities
- **Endpoint**: `GET /facilities`
- **Description**: List all facilities
- **Response**: Array of facility objects

### Get Facility Details
- **Endpoint**: `GET /facilities/{id}`
- **Description**: Get specific facility details

### Create Facility
- **Endpoint**: `POST /facilities`
- **Description**: Create new facility (Admin only)

### Book Facility
- **Endpoint**: `POST /facilities/{id}/book`
- **Description**: Book a facility
- **Request Body**:
  ```json
  {
    "startDate": "2026-04-25",
    "endDate": "2026-04-25",
    "startTime": "09:00",
    "endTime": "11:00",
    "reason": "Meeting"
  }
  ```

### Get Bookings
- **Endpoint**: `GET /facilities/{id}/bookings`
- **Description**: Get all bookings for a facility

---

## Event Endpoints

### Get All Events
- **Endpoint**: `GET /events`
- **Description**: List all events

### Create Event
- **Endpoint**: `POST /events`
- **Description**: Create new event

### Register for Event
- **Endpoint**: `POST /events/{id}/register`
- **Description**: Register user for event

### Get Event Details
- **Endpoint**: `GET /events/{id}`
- **Description**: Get specific event details

---

## Dashboard Endpoints

### Get Dashboard Statistics
- **Endpoint**: `GET /dashboard/stats`
- **Description**: Get campus statistics
- **Response**:
  ```json
  {
    "totalUsers": 5000,
    "activeEvents": 12,
    "facilitiesAvailable": 45,
    "upcomingBookings": 23
  }
  ```

---

## Error Responses

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User not authorized for this action |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "timestamp": "2026-04-21T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "path": "/api/users/invalid"
}
```

---

## Rate Limiting

- Rate limit: 1000 requests per hour per user
- Rate limit header: `X-RateLimit-Remaining`

---

## Versioning

Current API version: `v1`

Future versions can be accessed at `/api/v2`, etc.
