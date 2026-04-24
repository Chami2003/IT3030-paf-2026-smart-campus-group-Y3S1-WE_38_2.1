# Frontend - React Web Application

The frontend web application for Smart Campus management system.

## Technology Stack

- React 18+
- Node.js 14+
- npm/yarn
- Axios (HTTP client)
- React Router
- CSS/TailwindCSS (or your preferred styling)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Navigation.js
│   │   └── (other components)
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   └── (other pages)
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── package.json
└── Dockerfile
```

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Testing

```bash
npm test
```

## Docker

```bash
docker build -t smart-campus-frontend .
docker run -p 3000:3000 smart-campus-frontend
```

## API Communication

Configure API endpoint in `.env`:

```
REACT_APP_API_URL=http://localhost:8080
```

## Features

- User authentication and authorization
- Dashboard with campus statistics
- Facility booking system
- Event management
- Resource allocation
