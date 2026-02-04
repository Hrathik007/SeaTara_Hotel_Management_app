# Sitara Hotel Management System - Backend

A comprehensive hotel management REST API built with Spring Boot, MySQL, and JWT authentication.

## Features

- 🔐 JWT-based authentication and authorization
- 👥 User management (Admin & Customer roles)
- 🏨 Room management and booking system
- 📁 AWS S3 integration for image uploads
- 🔒 Spring Security for endpoint protection
- 📊 RESTful API design

## Tech Stack

- **Java 21**
- **Spring Boot 3.3.0**
- **MySQL 8.0** (Production)
- **H2 Database** (Local development)
- **Spring Security + JWT**
- **AWS S3**
- **Docker**

## Quick Start

### Local Development (H2 Database)

```bash
# Run with local profile
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Access at: `http://localhost:4040`

**Test Accounts:**
- Admin: `admin@sitara.com` / `admin123`
- User: `user@sitara.com` / `user123`

### Docker Deployment

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start services
docker-compose up -d
```

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users/all` - Get all users (Admin only)
- `GET /users/get-by-id/{userId}` - Get user by ID
- `DELETE /users/delete/{userId}` - Delete user (Admin only)

### Rooms
- `GET /rooms/all` - Get all rooms
- `GET /rooms/room-by-id/{roomId}` - Get room details
- `POST /rooms/add` - Add new room (Admin only)
- `PUT /rooms/update/{roomId}` - Update room (Admin only)
- `DELETE /rooms/delete/{roomId}` - Delete room (Admin only)

### Bookings
- `GET /bookings/all` - Get all bookings (Admin only)
- `GET /bookings/get-by-confirmation-code/{code}` - Get booking by code
- `POST /bookings/book-room/{roomId}/{userId}` - Create booking
- `DELETE /bookings/cancel/{bookingId}` - Cancel booking

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_DATASOURCE_URL` | Database connection URL | Yes |
| `SPRING_DATASOURCE_USERNAME` | Database username | Yes |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | Yes |
| `AWS_S3_ACCESS_KEY` | AWS access key | No |
| `AWS_S3_SECRET_KEY` | AWS secret key | No |

## Health Check

```bash
curl http://localhost:4040/actuator/health
```

## License

MIT

## Support

For deployment help, see [DEPLOYMENT.md](DEPLOYMENT.md)

