# 🏨 SeaTara Hotel Management System - Backend

A modern, robust Spring Boot REST API backend for hotel booking and management system with JWT authentication and role-based authorization.

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with role management (USER/ADMIN)
- Spring Security integration with custom filters
- Password encryption with BCrypt
- Token-based session management
- Role-based endpoint protection

### 🏠 User Management
- User registration and authentication
- Profile management and updates
- Booking history tracking
- Admin user oversight
- Secure password handling

### 🏨 Room Management
- Complete CRUD operations for rooms
- Room availability checking by date range
- Room filtering and search capabilities
- Room type and pricing management
- AWS S3 integration for image storage

### 📋 Booking Management
- Secure booking creation and management
- Unique confirmation code generation
- Date availability validation
- Booking modifications and cancellations
- Admin booking oversight and management

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven
- **Database**: MySQL/PostgreSQL with JPA/Hibernate
- **Security**: JWT Authentication & Spring Security
- **Cloud Storage**: AWS S3 Service
- **Java Version**: 11 or 17
- **Additional**: CORS configuration, Custom exception handling

## 📊 Project Metrics

✅ **19 REST API Endpoints**  
✅ **JWT Authentication System**  
✅ **Role-Based Access Control**  
✅ **AWS S3 File Storage**  
✅ **Database Integration**  
✅ **Exception Handling**  

## 🚀 Quick Start

### Prerequisites
- Java 11 or 17
- Maven 3.6+
- MySQL or PostgreSQL database
- AWS S3 credentials (optional for file upload features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hrathik007/SeaTara_Hotel_Management_app.git
cd SeaTara_Hotel_Management_app/backend

# Build the application (skip tests for faster build)
mvn clean package -DskipTests

# Run with Maven
mvn spring-boot:run

# Or run the JAR file
java -jar target/*.jar
```

The backend application will start on port 8080. Access APIs at `http://localhost:8080`.

### Configuration

Edit `src/main/resources/application.properties` for database and other settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/seatara_db
spring.datasource.username=root
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update

# Server Configuration
server.port=8080

# JWT Configuration
phegon.app.jwtSecret=mySecretKey
phegon.app.jwtExpirationMs=86400000

# AWS S3 Configuration (optional)
aws.s3.bucketName=your-bucket-name
```

## 🔄 Available Scripts

### `mvn spring-boot:run`
Runs the app in development mode.  
Open [http://localhost:8080](http://localhost:8080) to access the API endpoints.

The application will auto-reload when you make changes.  
You may also see any compilation errors in the console.

### `mvn test`
Launches the test runner and runs all unit tests.  
See the section about running tests for more information.

### `mvn clean package`
Builds the app for production to the `target/` folder.  
It correctly compiles the Spring Boot application and optimizes the build for the best performance.

The build creates a JAR file with all dependencies included.  
Your app is ready to be deployed!

### `mvn clean package -DskipTests`
Same as above but skips running tests for faster builds during development.

### `mvn spring-boot:run -Dspring-boot.run.profiles=local`
Runs the application with the local profile, using `application-local.properties` configuration.

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users/all` - Get all users (Admin)
- `GET /users/get-by-id/{userId}` - Get user by ID
- `DELETE /users/delete/{userId}` - Delete user (Admin)
- `GET /users/get-logged-in-profile-info` - Get current user profile
- `PUT /users/update/{userId}` - Update user profile

### Rooms
- `POST /rooms/add` - Add new room (Admin)
- `GET /rooms/all` - Get all rooms
- `GET /rooms/types` - Get room types
- `GET /rooms/room-by-id/{roomId}` - Get room by ID
- `PUT /rooms/update/{roomId}` - Update room (Admin)
- `DELETE /rooms/delete/{roomId}` - Delete room (Admin)
- `GET /rooms/available-rooms` - Get available rooms by date

### Bookings
- `POST /bookings/book-room/{roomId}/{userId}` - Create booking
- `GET /bookings/all` - Get all bookings (Admin)
- `GET /bookings/get-by-confirmation-code/{confirmationCode}` - Get booking by confirmation
- `DELETE /bookings/cancel/{bookingId}` - Cancel booking

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/phegondev/PhegonHotel/
│   │   │   ├── controller/          # REST API Controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── repo/                # Spring Data Repositories
│   │   │   ├── security/            # Security Configuration
│   │   │   ├── service/             # Business Logic Layer
│   │   │   └── utils/               # Utility Classes
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-local.properties
│   └── test/                        # Unit Tests
├── target/                          # Compiled Classes and JAR
├── pom.xml                         # Maven Dependencies
└── README.md                       # This File
```

## 🌟 Learn More

You can learn more in the [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/).

To learn about JWT authentication, check out the [JWT.io documentation](https://jwt.io/).

### Database Setup
This section covers database configuration and setup: [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

### AWS S3 Integration
Learn about file storage integration: [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-java/)

### Security Configuration
Advanced security setup: [Spring Security Documentation](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)

### Production Deployment
This section covers deployment strategies: [Spring Boot Deployment Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)

### `mvn clean package` fails to build
If you encounter build issues, check the [Maven Troubleshooting Guide](https://maven.apache.org/guides/mini/guide-ide-eclipse.html)
