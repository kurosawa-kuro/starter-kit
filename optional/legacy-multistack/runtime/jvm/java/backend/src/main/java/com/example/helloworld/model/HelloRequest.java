package com.example.helloworld.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Hello Request Model
 * 
 * Represents the request body for creating a personalized hello message.
 * Contains validation annotations to ensure data integrity.
 */
public class HelloRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;

    // Default constructor
    public HelloRequest() {
    }

    // Constructor with parameters
    public HelloRequest(String name, String message) {
        this.name = name;
        this.message = message;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "HelloRequest{" +
                "name='" + name + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
} 