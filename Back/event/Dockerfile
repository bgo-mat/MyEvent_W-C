# Utilise une image officielle de JDK pour construire l'application
FROM openjdk:17-jdk-slim AS build

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le script Gradle Wrapper et les fichiers de configuration nécessaires
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Copie le reste des fichiers de l'application
COPY src src

# Donner les permissions d'exécution au script Gradle Wrapper
RUN chmod +x gradlew

# Construire l'application Spring Boot avec Gradle
RUN ./gradlew build -x test

# Étape de production
FROM openjdk:17-jdk-slim
    
# Définit le répertoire de travail
WORKDIR /app

# Copier le fichier JAR de l'étape de construction
COPY --from=build /app/build/libs/*.jar app.jar

# Exposer le port de l'application Spring Boot
EXPOSE 8080

# Commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
