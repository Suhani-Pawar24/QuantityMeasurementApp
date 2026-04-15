# Backend Architecture Documentation

## Overview
The Quantity Measurement App backend is a Spring Boot 3.2.4 REST API that provides endpoints for unit conversions, measurements comparisons, and arithmetic operations.

## Project Structure

```
src/main/java/com/example/quantitymeasurement/
├── QuantityMeasurementApplication.java    [Main entry point]
├── config/
│   ├── CorsConfig.java                    [CORS configuration for React frontend]
│   └── DataInitializationConfig.java      [Database initialization with default units]
├── controller/
│   ├── UnitController.java                [/api/units endpoints]
│   ├── ConversionController.java          [/api/conversions endpoints]
│   ├── MeasurementController.java         [/api/measurements endpoints]
│   └── HistoryController.java             [/api/history endpoints]
├── service/
│   ├── UnitService.java                   [Unit management logic]
│   ├── ConversionService.java             [Unit conversion logic]
│   ├── MeasurementService.java            [Comparison & arithmetic logic]
│   └── HistoryService.java                [History record management]
├── repository/
│   ├── UnitRepository.java                [Unit database access]
│   ├── ConversionRepository.java          [Conversion database access]
│   └── HistoryRecordRepository.java       [History database access]
├── model/
│   ├── MeasurementType.java              [Enum: LENGTH, WEIGHT, TEMPERATURE, VOLUME]
│   ├── Unit.java                         [Unit entity]
│   ├── Conversion.java                   [Conversion entity]
│   └── HistoryRecord.java                [History record entity]
├── dto/
│   ├── UnitDTO.java
│   ├── ConversionRequestDTO.java
│   ├── ConversionResponseDTO.java
│   ├── MeasurementComparisonRequestDTO.java
│   ├── MeasurementArithmeticRequestDTO.java
│   ├── HistoryRecordDTO.java
│   ├── ApiResponseDTO.java               [Generic success response wrapper]
│   └── ErrorResponseDTO.java             [Error response wrapper]
├── exception/
│   ├── UnitNotFoundException.java
│   └── GlobalExceptionHandler.java       [Centralized exception handling]
└── utils/
    └── ValidationUtils.java              [Common validation utilities]

src/main/resources/
└── application.properties                [Spring Boot configuration]
```

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Spring Boot 3.2.4 |
| **Web** | Spring MVC / REST |
| **Database** | JPA/Hibernate with H2 (in-memory) |
| **ORM** | Spring Data JPA |
| **Build Tool** | Maven 3.x |
| **Java Version** | Java 17+ |
| **CORS** | Spring WebMvcConfigurer |
| **Logging** | SLF4J + Logback |
| **Validation** | Jakarta Bean Validation |
| **JSON** | Jackson ObjectMapper |
| **Lombok** | Reduce boilerplate code |

## Database Schema

### Units Table
```sql
CREATE TABLE units (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,           -- LENGTH, WEIGHT, TEMPERATURE, VOLUME
  symbol VARCHAR(10) NOT NULL UNIQUE,  -- m, ft, kg, lb, C, F, L, gal
  label VARCHAR(100) NOT NULL,         -- Meter, Foot, Kilogram, Pound
  base_unit_factor DOUBLE NOT NULL,    -- Conversion factor to base unit
  description VARCHAR(500)
);
```

### Conversions Table
```sql
CREATE TABLE conversions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  from_unit_id BIGINT NOT NULL FOREIGN KEY (units),
  to_unit_id BIGINT NOT NULL FOREIGN KEY (units),
  factor DOUBLE NOT NULL,
  formula VARCHAR(255) NOT NULL,
  UNIQUE (from_unit_id, to_unit_id)
);
```

### History Table
```sql
CREATE TABLE history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,           -- Conversion, Comparison, Arithmetic
  action VARCHAR(50) NOT NULL,
  expression VARCHAR(500) NOT NULL,
  result VARCHAR(500) NOT NULL,
  timestamp TIMESTAMP NOT NULL
);
```

## REST API Endpoints

### 1. Units Management

**Get Units by Type**
```
GET /api/units?type=LENGTH
Response: { success: true, data: [{ id, type, symbol, label, baseUnitFactor, description }...] }
```

**Get All Units**
```
GET /api/units/all
Response: { success: true, data: [{ id, type, symbol, label, baseUnitFactor, description }...] }
```

### 2. Conversions

**Perform Conversion**
```
POST /api/conversions
Request: {
  "value": 100,
  "fromUnit": "m",
  "toUnit": "ft"
}
Response: {
  "success": true,
  "data": {
    "fromValue": 100,
    "fromUnit": "m",
    "toValue": 328.0839,
    "toUnit": "ft",
    "formattedResult": "328.0839 Foot"
  }
}
```

### 3. Measurements

**Compare Measurements**
```
POST /api/measurements/compare
Request: {
  "value1": 100,
  "unit1": "m",
  "value2": 330,
  "unit2": "ft"
}
Response: {
  "success": true,
  "data": "100.000000 m > 330.000000 ft"
}
```

**Perform Arithmetic**
```
POST /api/measurements/arithmetic
Request: {
  "value1": 100,
  "unit1": "m",
  "value2": 50,
  "unit2": "m",
  "operator": "+"
}
Response: {
  "success": true,
  "data": {
    "fromValue": 100,
    "fromUnit": "m",
    "toValue": 150,
    "toUnit": "m",
    "formattedResult": "150.0000 Meter"
  }
}
```

Supported operators: `+`, `-`, `*`, `/`

### 4. History

**Get All History**
```
GET /api/history
Response: {
  "success": true,
  "data": [{ id, type, action, expression, result, timestamp }...]
}
```

**Get History by Type**
```
GET /api/history/by-type?type=Conversion
```

**Get History by Action**
```
GET /api/history/by-action?action=Conversion
```

**Get Recent History**
```
GET /api/history/recent?hours=24
```

**Delete History Record**
```
DELETE /api/history/{id}
```

**Clear All History**
```
DELETE /api/history
```

## Supported Units

### Length (Base: Meter)
- m (Meter)
- cm (Centimeter)
- mm (Millimeter)
- km (Kilometer)
- ft (Foot)
- in (Inch)
- yd (Yard)
- mi (Mile)

### Weight (Base: Kilogram)
- kg (Kilogram)
- g (Gram)
- mg (Milligram)
- lb (Pound)
- oz (Ounce)
- t (Ton)

### Temperature
- C (Celsius)
- F (Fahrenheit)
- K (Kelvin)

### Volume (Base: Liter)
- L (Liter)
- ml (Milliliter)
- gal (Gallon)
- pt (Pint)
- fl oz (Fluid Ounce)

## Configuration

### CORS Settings (`application.properties`)
```properties
spring.application.name=quantity-measurement-app
server.port=8080
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
logging.level.com.example.quantitymeasurement=DEBUG
```

**Allowed Origins:**
- http://localhost:3000 (React dev server)
- http://localhost:5173 (Vite dev server)
- http://127.0.0.1:3000

## Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "status": 400,
  "message": "Invalid input provided",
  "error": "Unit with symbol 'xyz' not found",
  "timestamp": "2026-04-13T10:30:00",
  "path": "/api/conversions",
  "validationErrors": { }
}
```

## How to Build & Run

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher (or use Maven wrapper)

### Build
```bash
cd c:\Users\suhan\QuantityMeasurementApp
mvn clean package
```

### Run
```bash
mvn spring-boot:run
```

Or run the JAR:
```bash
mvn clean package
java -jar target/quantity-measurement-app-1.0.0.jar
```

### Access the Application
- **API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console (use default credentials)

## Testing the Backend

### Using cURL

**Get units:**
```bash
curl -X GET http://localhost:8080/api/units?type=LENGTH
```

**Perform conversion:**
```bash
curl -X POST http://localhost:8080/api/conversions \
  -H "Content-Type: application/json" \
  -d '{"value": 100, "fromUnit": "m", "toUnit": "ft"}'
```

## Integration with React Frontend

The React frontend communicates with this backend via:
1. **Custom Hooks**: useUnits, useConversion, useHistory
2. **API Service**: axios wrapper for HTTP calls
3. **Context API**: Global state management
4. **Base URL**: http://localhost:8080/api

See React use cases document for frontend implementation details.

## Security Considerations

- CORS configured for localhost only (development)
- Input validation on all endpoints
- Exception handling prevents information leakage
- No authentication/authorization (add Spring Security for production)

## Future Enhancements

1. Add unit tests with JUnit 5 and MockMvc
2. Add API documentation with Swagger/Springdoc
3. Add database migration with Flyway
4. Add caching with Redis
5. Add authentication with Spring Security
6. Add PostgreSQL support for production
7. Add logging to ELK stack
8. Add monitoring with Actuator and Prometheus
