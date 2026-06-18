# .env - Backend Configuration

## Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/arena
SPRING_DATASOURCE_USERNAME=arena
SPRING_DATASOURCE_PASSWORD=arena123
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

## JPA/Hibernate
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect

## Application
APP_UPLOAD_DIR=/app/uploads
SPRING_PROFILES_ACTIVE=prod

## AWS ECS - Use este formato para Task Definition
## Copie as variáveis acima no console AWS ECS ou configure via AWS_ENV

## AWS ECS Task Definition JSON Example:
## "environment": [
##   {"name": "SPRING_DATASOURCE_URL", "value": "jdbc:postgresql://postgres:5432/arena"},
##   {"name": "SPRING_DATASOURCE_USERNAME", "value": "arena"},
##   {"name": "SPRING_DATASOURCE_PASSWORD", "value": "arena123"},
##   {"name": "SPRING_DATASOURCE_DRIVER_CLASS_NAME", "value": "org.postgresql.Driver"},
##   {"name": "SPRING_JPA_DATABASE_PLATFORM", "value": "org.hibernate.dialect.PostgreSQLDialect"},
##   {"name": "APP_UPLOAD_DIR", "value": "/app/uploads"},
##   {"name": "SPRING_PROFILES_ACTIVE", "value": "prod"}
## ]
