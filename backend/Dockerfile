FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline -DskipTests

EXPOSE 8080

CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.fork=false"]
