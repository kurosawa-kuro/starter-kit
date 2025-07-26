package com.example.helloworld.model

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/**
 * Hello Request Model
 * 
 * Represents the request body for creating a personalized hello message.
 * Contains validation annotations to ensure data integrity.
 */
data class HelloRequest(
    @field:NotBlank(message = "Name is required")
    @field:Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    val name: String,
    
    @field:Size(max = 500, message = "Message must not exceed 500 characters")
    val message: String? = null
) 