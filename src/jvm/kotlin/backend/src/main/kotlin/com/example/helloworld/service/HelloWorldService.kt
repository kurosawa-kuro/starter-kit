package com.example.helloworld.service

import com.example.helloworld.model.HelloRequest
import com.example.helloworld.model.HelloResponse
import org.springframework.stereotype.Service
import java.time.LocalDateTime

/**
 * Hello World Service
 * 
 * Contains the business logic for the Hello World API.
 * Handles message generation and processing.
 */
@Service
class HelloWorldService {

    companion object {
        private const val DEFAULT_GREETING = "Hello, World!"
        private const val PERSONALIZED_GREETING_TEMPLATE = "Hello, %s!"
    }

    /**
     * Get a default hello message
     * 
     * @return HelloResponse with default greeting
     */
    fun getHelloMessage(): HelloResponse {
        return HelloResponse(
            message = DEFAULT_GREETING,
            timestamp = LocalDateTime.now(),
            status = "success"
        )
    }

    /**
     * Get a personalized hello message
     * 
     * @param name the name to greet
     * @return HelloResponse with personalized greeting
     */
    fun getHelloMessage(name: String?): HelloResponse {
        val message = when {
            name.isNullOrBlank() -> DEFAULT_GREETING
            else -> PERSONALIZED_GREETING_TEMPLATE.format(name.trim())
        }
        
        return HelloResponse(
            message = message,
            timestamp = LocalDateTime.now(),
            status = "success"
        )
    }

    /**
     * Create a personalized hello message from request
     * 
     * @param request the request containing name and optional message
     * @return HelloResponse with personalized greeting
     */
    fun createHelloMessage(request: HelloRequest): HelloResponse {
        val name = request.name
        val customMessage = request.message
        
        val baseMessage = when {
            name.isBlank() -> DEFAULT_GREETING
            else -> PERSONALIZED_GREETING_TEMPLATE.format(name.trim())
        }
        
        val finalMessage = when {
            customMessage.isNullOrBlank() -> baseMessage
            else -> "$baseMessage ${customMessage.trim()}"
        }
        
        return HelloResponse(
            message = finalMessage,
            timestamp = LocalDateTime.now(),
            status = "success"
        )
    }
} 