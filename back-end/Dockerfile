FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:resolve

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app

RUN mkdir -p /app/uploads

COPY --from=builder /app/target/arenape-*.jar app.jar

RUN addgroup -g 1000 spring && adduser -D -u 1000 -G spring spring
USER spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
