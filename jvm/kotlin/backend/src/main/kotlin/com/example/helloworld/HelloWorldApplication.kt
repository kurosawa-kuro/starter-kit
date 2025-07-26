package com.example.helloworld

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Spring Boot Hello World API Application (Kotlin)
 * 
 * This is the main entry point for the Hello World API application.
 * It uses Spring Boot's auto-configuration to set up a web server
 * and expose REST endpoints.
 */
@SpringBootApplication
class HelloWorldApplication

/**
 * Main function to start the Spring Boot application
 * 
 * @param args command line arguments
 */
fun main(args: Array<String>) {
    runApplication<HelloWorldApplication>(*args)
} 