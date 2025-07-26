package com.example.helloworld.controller

import com.example.helloworld.model.HelloResponse
import com.example.helloworld.model.HelloRequest
import com.example.helloworld.service.HelloWorldService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import java.time.LocalDateTime

/**
 * Hello World API Controller
 * 
 * Provides REST endpoints for the Hello World API.
 * Handles HTTP requests and delegates business logic to the service layer.
 */
@RestController
@RequestMapping("/api/v1/hello")
@CrossOrigin(origins = ["*"])
class HelloWorldController(
    private val helloWorldService: HelloWorldService
) {

    /**
     * GET endpoint to retrieve a simple hello message
     * 
     * @return HelloResponse with a greeting message
     */
    @GetMapping
    fun getHello(): ResponseEntity<HelloResponse> {
        val response = helloWorldService.getHelloMessage()
        return ResponseEntity.ok(response)
    }

    /**
     * GET endpoint to retrieve a personalized hello message
     * 
     * @param name the name to greet
     * @return HelloResponse with a personalized greeting
     */
    @GetMapping("/{name}")
    fun getHelloWithName(@PathVariable name: String): ResponseEntity<HelloResponse> {
        val response = helloWorldService.getHelloMessage(name)
        return ResponseEntity.ok(response)
    }

    /**
     * POST endpoint to create a personalized hello message
     * 
     * @param request the request containing name and optional message
     * @return HelloResponse with a personalized greeting
     */
    @PostMapping
    fun createHello(@Valid @RequestBody request: HelloRequest): ResponseEntity<HelloResponse> {
        val response = helloWorldService.createHelloMessage(request)
        return ResponseEntity.ok(response)
    }

    /**
     * GET endpoint to check API health
     * 
     * @return HelloResponse with health status
     */
    @GetMapping("/health")
    fun getHealth(): ResponseEntity<HelloResponse> {
        val response = HelloResponse(
            message = "Hello World API is running!",
            timestamp = LocalDateTime.now(),
            status = "healthy"
        )
        return ResponseEntity.ok(response)
    }
} 