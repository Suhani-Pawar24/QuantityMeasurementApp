# Backend Quick Start Guide

## 1. Install Prerequisites

### Java 17+
Download from: https://www.oracle.com/java/technologies/downloads/
Verify installation:
```bash
java -version
```

### Maven 3.6+
Download from: https://maven.apache.org/download.cgi
Extract and add to PATH, then verify:
```bash
mvn -version
```

**OR use Maven Wrapper (already included)**:
```bash
.\mvnw --version  (Windows)
./mvnw --version  (Linux/Mac)
```

## 2. Build the Backend

Navigate to project directory:
```bash
cd c:\Users\suhan\QuantityMeasurementApp
```

Clean and build:
```bash
mvn clean package -DskipTests
```

Or with Maven Wrapper (if installed):
```bash
.\mvnw clean package -DskipTests
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX.XXs
```

## 3. Run the Backend

### Option A: Using Spring Boot Maven Plugin
```bash
mvn spring-boot:run
```

### Option B: Run JAR Directly
```bash
java -jar target/quantity-measurement-app-1.0.0.jar
```

You should see:
```
✓ Application started successfully
✓ Database initialized with default units
✓ Server running on http://localhost:8080
```

## 4. Verify Backend is Running

1. Open browser: http://localhost:8080/h2-console
2. Test API with curl:
```bash
curl http://localhost:8080/api/units?type=LENGTH
```

Expected response:
```json
{
  "success": true,
  "message": "Units fetched successfully",
  "data": [
    {
      "id": 1,
      "type": "LENGTH",
      "symbol": "m",
      "label": "Meter",
      "baseUnitFactor": 1.0,
      "description": "SI unit of length"
    },
    ...
  ]
}
```

## 5. Backend Architecture

### Key Components
- **Controllers**: REST endpoints in `/api` routes
- **Services**: Business logic for conversions, comparisons, arithmetic
- **Repositories**: Database access layer using Spring Data JPA
- **Models**: Entity classes (Unit, Conversion, HistoryRecord)
- **DTOs**: Data transfer objects for API communication
- **Config**: CORS and database initialization

### Database
- **Type**: H2 (in-memory, created on startup)
- **Console**: http://localhost:8080/h2-console
- **Default credentials**: username=sa, password=(empty)

### Endpoints
- `GET /api/units?type=LENGTH` - Get units by type
- `POST /api/conversions` - Perform conversion
- `POST /api/measurements/compare` - Compare measurements
- `POST /api/measurements/arithmetic` - Arithmetic operations
- `GET /api/history` - Get history records
- `POST /api/history` - Save history
- `DELETE /api/history/{id}` - Delete history record

## 6. Testing with Thunder Client or Postman

### Test 1: Get Units
```
Method: GET
URL: http://localhost:8080/api/units?type=LENGTH
Headers: None needed
```

### Test 2: Convert Units
```
Method: POST
URL: http://localhost:8080/api/conversions
Headers: Content-Type: application/json
Body: {
  "value": 100,
  "fromUnit": "m",
  "toUnit": "ft"
}
```

### Test 3: Compare Measurements
```
Method: POST
URL: http://localhost:8080/api/measurements/compare
Headers: Content-Type: application/json
Body: {
  "value1": 100,
  "unit1": "m",
  "value2": 330,
  "unit2": "ft"
}
```

### Test 4: Arithmetic Operations
```
Method: POST
URL: http://localhost:8080/api/measurements/arithmetic
Headers: Content-Type: application/json
Body: {
  "value1": 100,
  "unit1": "m",
  "value2": 50,
  "unit2": "m",
  "operator": "+"
}
```

### Test 5: Get History
```
Method: GET
URL: http://localhost:8080/api/history
Headers: None needed
```

## 7. Common Issues & Solutions

### Issue: Port 8080 already in use
**Solution**: Change port in `application.properties`:
```properties
server.port=8081
```

### Issue: Maven dependencies not downloading
**Solution**: Clear cache and retry:
```bash
mvn clean
mvn install -U
```

### Issue: Java version mismatch
**Solution**: Install Java 17+
```bash
java -version  # Should show 17 or higher
```

### Issue: Can't connect to H2 database
**Solution**: Database is auto-created. Check logs for errors:
```bash
mvn spring-boot:run 2>&1 | grep -i "error\|exception"
```

## 8. Next Steps

1. ✅ Backend is ready for React frontend integration
2. Create React frontend using the use cases document
3. Configure React to call these API endpoints
4. Test end-to-end integration
5. Deploy to production with proper database (PostgreSQL/MySQL)

## 9. Production Deployment

For production, modify `application.properties`:
```properties
# Switch to MySQL/PostgreSQL
spring.datasource.url=jdbc:mysql://host:3306/qma_db
spring.datasource.username=root
spring.datasource.password=secure_password
spring.jpa.hibernate.ddl-auto=validate

# Security
spring.security.user.name=admin
spring.security.user.password=secure_password

# CORS - restrict to your domain
cors.allowed-origins=https://yourdomain.com
```

---

## Support

For issues or questions, check:
1. Backend Architecture Documentation: `BACKEND_ARCHITECTURE.md`
2. Spring Boot Docs: https://spring.io/projects/spring-boot
3. React Use Cases: `Use Cases Document` in project root
