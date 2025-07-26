import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
    kotlin("jvm") version "1.9.20"
    kotlin("plugin.spring") version "1.9.20"
}

group = "com.example"
version = "1.0.0"
description = "Spring Boot Hello World API (Kotlin)"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Web Starter
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    // Spring Boot Validation
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // Spring Boot Actuator for health checks
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    
    // Jackson for JSON processing
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    
    // Kotlin reflection
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    
    // Test dependencies
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xjsr305=strict"
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
} 