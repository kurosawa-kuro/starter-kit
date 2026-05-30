package com.example.helloworld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot Hello World API Application
 * 
 * This is the main entry point for the Hello World API application.
 * It uses Spring Boot's auto-configuration to set up a web server
 * and expose REST endpoints.
 */
@SpringBootApplication
public class HelloWorldApplication {

    /**
     * Main method to start the Spring Boot application
     * 
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(HelloWorldApplication.class, args);
    }
} 