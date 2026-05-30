package com.example.helloworld.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Hello Response Model
 * 
 * Represents the response body for hello world API endpoints.
 * Contains the greeting message, timestamp, and status information.
 */
public class HelloResponse {

    private String message;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String status;

    // Default constructor
    public HelloResponse() {
        this.timestamp = LocalDateTime.now();
        this.status = "success";
    }

    // Constructor with message
    public HelloResponse(String message) {
        this();
        this.message = message;
    }

    // Constructor with all parameters
    public HelloResponse(String message, LocalDateTime timestamp, String status) {
        this.message = message;
        this.timestamp = timestamp;
        this.status = status;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "HelloResponse{" +
                "message='" + message + '\'' +
                ", timestamp=" + timestamp +
                ", status='" + status + '\'' +
                '}';
    }
} 