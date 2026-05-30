package com.example.helloworld.service;

import com.example.helloworld.model.HelloRequest;
import com.example.helloworld.model.HelloResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Hello World Service
 * 
 * Contains the business logic for the Hello World API.
 * Handles message generation and processing.
 */
@Service
public class HelloWorldService {

    private static final String DEFAULT_GREETING = "Hello, World!";
    private static final String PERSONALIZED_GREETING_TEMPLATE = "Hello, %s!";

    /**
     * Get a default hello message
     * 
     * @return HelloResponse with default greeting
     */
    public HelloResponse getHelloMessage() {
        HelloResponse response = new HelloResponse();
        response.setMessage(DEFAULT_GREETING);
        response.setTimestamp(LocalDateTime.now());
        response.setStatus("success");
        return response;
    }

    /**
     * Get a personalized hello message
     * 
     * @param name the name to greet
     * @return HelloResponse with personalized greeting
     */
    public HelloResponse getHelloMessage(String name) {
        HelloResponse response = new HelloResponse();
        
        if (name == null || name.trim().isEmpty()) {
            response.setMessage(DEFAULT_GREETING);
        } else {
            String personalizedMessage = String.format(PERSONALIZED_GREETING_TEMPLATE, name.trim());
            response.setMessage(personalizedMessage);
        }
        
        response.setTimestamp(LocalDateTime.now());
        response.setStatus("success");
        return response;
    }

    /**
     * Create a personalized hello message from request
     * 
     * @param request the request containing name and optional message
     * @return HelloResponse with personalized greeting
     */
    public HelloResponse createHelloMessage(HelloRequest request) {
        HelloResponse response = new HelloResponse();
        
        String name = request.getName();
        String customMessage = request.getMessage();
        
        if (name == null || name.trim().isEmpty()) {
            response.setMessage(DEFAULT_GREETING);
        } else {
            String personalizedMessage = String.format(PERSONALIZED_GREETING_TEMPLATE, name.trim());
            
            // If custom message is provided, append it
            if (customMessage != null && !customMessage.trim().isEmpty()) {
                personalizedMessage += " " + customMessage.trim();
            }
            
            response.setMessage(personalizedMessage);
        }
        
        response.setTimestamp(LocalDateTime.now());
        response.setStatus("success");
        return response;
    }
} 