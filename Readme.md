# Full Stack Authentication Application

A production-ready full-stack authentication application built with React, NestJS, and MongoDB. This application implements user authentication with JWT tokens, comprehensive logging, and follows industry best practices.

## 🚀 Features

### Frontend (React + TypeScript)
- **User Authentication**: Sign up and sign in functionality
- **Form Validation**: 
  - Email format validation
  - Name minimum 3 characters
  - Password: 8+ characters, includes letter, number, and special character
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Modern UI**: Material-UI design with responsive layout
- **State Management**: Context API for authentication state
- **Error Handling**: Toast notifications for user feedback

### Backend (NestJS + MongoDB)
- **RESTful API**: Clean and well-documented endpoints
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing for password storage
- **MongoDB Integration**: Mongoose ODM with proper schemas
- **Logging System**: Comprehensive logging saved to MongoDB
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet for security headers, CORS configuration
- **Validation**: DTO validation with class-validator

## Prerequisites

- Node.js 22 and npm
- Docker and Docker Compose
- Git

## 🛠️ Installation and Setup

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/0xtaha/auth-service.git
cd auth-service
```

2. Create environment file:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs
- MongoDB: localhost:27017

### Manual Installation

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update MongoDB connection string in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your-secret-key-here
```

5. Start MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

6. Run the backend:
```bash
npm run start:dev  # Development
npm run start:prod  # Production
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the frontend:
```bash
npm run dev  # Development
npm run build && npm run preview  # Production
```
## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/signin
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate the JWT token (Protected endpoint).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

#### GET /api/auth/profile
Get current user profile (Protected endpoint).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## 🗄️ MongoDB Schemas

### User Schema
```javascript
{
  email: String (unique, required),
  name: String (required, min: 3),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Log Schema
```javascript
{
  level: String (info, error, warn, debug),
  message: String,
  meta: Object (additional data),
  timestamp: Date,
  userId: String (optional),
  requestId: String (optional),
  ip: String (optional),
  userAgent: String (optional)
}
```

### Blacklisted Token Schema
```javascript
{
  token: String (unique, required),
  userId: String (required),
  blacklistedAt: Date,
  expiresAt: Date (TTL index for auto-removal)
}
```

## Logging

The application implements comprehensive logging that:
- Logs all API requests with response times
- Stores logs in MongoDB for persistence
- Includes different log levels (info, error, warn, debug)
- Tracks user actions and authentication attempts
- Provides console output and file storage

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: DTO validation on all endpoints
- **Helmet**: Security headers middleware
- **CORS**: Configured for production use
- **Environment Variables**: Sensitive data in .env files
- **Protected Routes**: JWT guard for authenticated endpoints


## Deployment

### Production Build

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
# Serve dist folder with any static file server
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Run in production
docker-compose -f docker-compose.yml up -d
```

## Development

### Running in Development Mode

1. Start MongoDB:
```bash
docker run -d -p 27017:27017 mongo:7.0
```

2. Start Backend (with hot reload):
```bash
cd backend
npm run start:dev
```

3. Start Frontend (with hot reload):
```bash
cd frontend
npm run dev
```

### Environment Variables

#### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS
- `NODE_ENV`: Environment (development/production)

#### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **React Router**: Navigation
- **React Hook Form**: Form handling
- **Yup**: Schema validation
- **Axios**: HTTP client
- **Vite**: Build tool

### Backend
- **NestJS**: Node.js framework
- **TypeScript**: Type safety
- **MongoDB**: NoSQL database
- **Mongoose**: ODM
- **Passport**: Authentication
- **JWT**: Token authentication
- **Bcrypt**: Password hashing
- **Winston**: Logging
- **Swagger**: API documentation
- **Helmet**: Security

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for frontend

**Note**: Remember to change the JWT secret and database credentials before deploying to production!