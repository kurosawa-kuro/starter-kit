package com.example.helloworld.controller;

import com.example.helloworld.model.HelloResponse;
import com.example.helloworld.model.HelloRequest;
import com.example.helloworld.service.HelloWorldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;

/**
 * Hello World API Controller
 * 
 * Provides REST endpoints for the Hello World API.
 * Handles HTTP requests and delegates business logic to the service layer.
 */
@RestController
@RequestMapping("/api/v1/hello")
@CrossOrigin(origins = "*")
public class HelloWorldController {

    private final HelloWorldService helloWorldService;

    @Autowired
    public HelloWorldController(HelloWorldService helloWorldService) {
        this.helloWorldService = helloWorldService;
    }

    /**
     * GET endpoint to retrieve a simple hello message
     * 
     * @return HelloResponse with a greeting message
     */
    @GetMapping
    public ResponseEntity<HelloResponse> getHello() {
        HelloResponse response = helloWorldService.getHelloMessage();
        return ResponseEntity.ok(response);
    }

    /**
     * GET endpoint to retrieve a personalized hello message
     * 
     * @param name the name to greet
     * @return HelloResponse with a personalized greeting
     */
    @GetMapping("/{name}")
    public ResponseEntity<HelloResponse> getHelloWithName(@PathVariable String name) {
        HelloResponse response = helloWorldService.getHelloMessage(name);
        return ResponseEntity.ok(response);
    }

    /**
     * POST endpoint to create a personalized hello message
     * 
     * @param request the request containing name and optional message
     * @return HelloResponse with a personalized greeting
     */
    @PostMapping
    public ResponseEntity<HelloResponse> createHello(@Valid @RequestBody HelloRequest request) {
        HelloResponse response = helloWorldService.createHelloMessage(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET endpoint to check API health
     * 
     * @return HelloResponse with health status
     */
    @GetMapping("/health")
    public ResponseEntity<HelloResponse> getHealth() {
        HelloResponse response = new HelloResponse();
        response.setMessage("Hello World API is running!");
        response.setTimestamp(LocalDateTime.now());
        response.setStatus("healthy");
        return ResponseEntity.ok(response);
    }
} 