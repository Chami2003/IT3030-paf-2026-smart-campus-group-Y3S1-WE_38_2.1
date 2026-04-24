# Smart Campus Operations Hub - OAuth 2.0 Implementation

## Overview

This project implements a complete OAuth 2.0 authentication system using Google Sign-In for the Smart Campus application. It includes:

- **Backend**: Spring Boot REST API with OAuth 2.0, JWT tokens, and role-based access control
- **Frontend**: React application with Google Sign-In integration and protected routes
- **Security**: JWT token validation, role management, and CORS configuration

## Setup Instructions

### Prerequisites

- Java 11+
- Node.js 14+
- MySQL 8.0+
- Google OAuth 2.0 credentials (Client ID & Secret)

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
   - Type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:8080/login/oauth2/code/google`
5. Copy your **Client ID** and **Client Secret**

### Step 2: Backend Setup

1. **Update application.properties**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
   spring.datasource.username=root
   spring.datasource.password=root
   
   # OAuth Configuration
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   
   # JWT Secret (change this to a strong secret)
   jwt.secret=your-super-secret-key-min-256-bits-long-for-security-smartcampus
   ```

2. **Create database**
   ```sql
   CREATE DATABASE smart_campus;
   ```

3. **Build and run**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will run at `http://localhost:8080`

### Step 3: Frontend Setup

1. **Update Google Client ID in index.js**
   ```javascript
   <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   Frontend will run at `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user info |
| GET | `/api/auth/verify` | Verify JWT token |
| GET | `/api/auth/{userId}` | Get user by ID |
| PUT | `/api/auth/{userId}/role` | Update user role (Admin) |
| DELETE | `/api/auth/{userId}` | Delete user (Admin) |
| POST | `/api/auth/logout` | Logout |

### Example Requests

**Get Current User:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/auth/me
```

**Update User Role:**
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8080/api/auth/1/role?role=ADMIN"
```

## User Roles

- **USER**: Default role for all users
- **ADMIN**: Full system access, user management
- **TECHNICIAN**: Can manage support tickets
- **MANAGER**: Can manage facilities and bookings

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  picture LONGTEXT,
  google_id VARCHAR(255) UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at BIGINT,
  updated_at BIGINT
);

CREATE TABLE users_roles (
  user_id BIGINT,
  roles VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Frontend Components

- **Login.js**: Google Sign-In component
- **Dashboard.js**: Main user dashboard
- **AdminPanel.js**: Admin user management
- **ProtectedRoute.js**: Route protection with role checking
- **CallbackPage.js**: OAuth callback handler

## Security Features

✅ OAuth 2.0 authentication  
✅ JWT token-based authorization  
✅ Role-based access control (RBAC)  
✅ CORS configuration  
✅ Secure password practices  
✅ XSS protection  
✅ CSRF protection  

## Environment Variables

### Backend (.env or application.properties)

```properties
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
DB_URL=jdbc:mysql://localhost:3306/smart_campus
DB_USER=root
DB_PASSWORD=root
```

### Frontend (.env.local)

```
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Troubleshooting

### Redirect URI Mismatch Error
- Check Google Cloud Console for correct redirect URIs
- Ensure `http://localhost:8080/login/oauth2/code/google` is added to redirect URIs

### CORS Errors
- Verify CORS configuration in `WebMvcConfig.java`
- Check that frontend URL is in allowed origins

### JWT Token Expired
- Token expires after 24 hours by default
- Users need to re-login or refresh token

### Database Connection Failed
- Ensure MySQL is running
- Check database credentials in `application.properties`

## Testing OAuth Flow

1. Open `http://localhost:3000`
2. Click "Sign in with Google"
3. Select your Google account
4. You will be redirected to `/callback`
5. JWT token will be stored in localStorage
6. You will be redirected to `/dashboard`

## Individual Contribution (Chami2003)

As the OAuth/Authentication implementer:
- ✅ Implemented Google OAuth 2.0 integration
- ✅ Created JWT token provider and filter
- ✅ Implemented role-based access control
- ✅ Created security configuration
- ✅ Implemented authentication controller with 4+ endpoints:
  - GET /api/auth/me
  - GET /api/auth/verify
  - GET /api/auth/{userId}
  - PUT /api/auth/{userId}/role
  - DELETE /api/auth/{userId}
  - POST /api/auth/logout

- ✅ Created protected routes on frontend
- ✅ Implemented login component with Google Sign-In
- ✅ Created admin panel for user management

## Next Steps

1. Integrate with Facilities & Assets module
2. Integrate with Booking Management
3. Implement Notifications module
4. Add more endpoints for other modules
5. Set up GitHub Actions CI/CD pipeline
6. Deploy to production environment

## References

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JWT.io](https://jwt.io)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)

---

**Project**: IT3030 - Programming Applications and Frameworks  
**Assignment**: 2026 (Semester 1)  
**Implemented By**: Chami2003  
**Date**: April 2026
