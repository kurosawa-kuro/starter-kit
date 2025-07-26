package com.example.helloworld.model

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

/**
 * Hello Response Model
 * 
 * Represents the response body for hello world API endpoints.
 * Contains the greeting message, timestamp, and status information.
 */
data class HelloResponse(
    val message: String,
    
    @field:JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val timestamp: LocalDateTime = LocalDateTime.now(),
    
    val status: String = "success"
) 