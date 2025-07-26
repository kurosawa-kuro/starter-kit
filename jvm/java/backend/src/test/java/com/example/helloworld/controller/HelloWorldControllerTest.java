package com.example.helloworld.controller;

import com.example.helloworld.model.HelloRequest;
import com.example.helloworld.model.HelloResponse;
import com.example.helloworld.service.HelloWorldService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Hello World Controller Unit Tests
 * 
 * Tests the REST endpoints provided by the HelloWorldController.
 */
@WebMvcTest(HelloWorldController.class)
class HelloWorldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HelloWorldService helloWorldService;

    @Autowired
    private ObjectMapper objectMapper;

    private HelloResponse mockResponse;

    @BeforeEach
    void setUp() {
        mockResponse = new HelloResponse();
        mockResponse.setMessage("Hello, World!");
        mockResponse.setTimestamp(LocalDateTime.now());
        mockResponse.setStatus("success");
    }

    /**
     * Test GET /api/v1/hello endpoint
     */
    @Test
    void testGetHello() throws Exception {
        when(helloWorldService.getHelloMessage()).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/hello"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello, World!"))
                .andExpect(jsonPath("$.status").value("success"));
    }

    /**
     * Test GET /api/v1/hello/{name} endpoint
     */
    @Test
    void testGetHelloWithName() throws Exception {
        HelloResponse personalizedResponse = new HelloResponse();
        personalizedResponse.setMessage("Hello, John!");
        personalizedResponse.setTimestamp(LocalDateTime.now());
        personalizedResponse.setStatus("success");

        when(helloWorldService.getHelloMessage("John")).thenReturn(personalizedResponse);

        mockMvc.perform(get("/api/v1/hello/John"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello, John!"))
                .andExpect(jsonPath("$.status").value("success"));
    }

    /**
     * Test POST /api/v1/hello endpoint
     */
    @Test
    void testCreateHello() throws Exception {
        HelloRequest request = new HelloRequest("Alice", "Welcome!");
        HelloResponse response = new HelloResponse();
        response.setMessage("Hello, Alice! Welcome!");
        response.setTimestamp(LocalDateTime.now());
        response.setStatus("success");

        when(helloWorldService.createHelloMessage(any(HelloRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/hello")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello, Alice! Welcome!"))
                .andExpect(jsonPath("$.status").value("success"));
    }

    /**
     * Test GET /api/v1/hello/health endpoint
     */
    @Test
    void testGetHealth() throws Exception {
        mockMvc.perform(get("/api/v1/hello/health"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Hello World API is running!"))
                .andExpect(jsonPath("$.status").value("healthy"));
    }

    /**
     * Test POST /api/v1/hello with invalid request (missing name)
     */
    @Test
    void testCreateHelloWithInvalidRequest() throws Exception {
        HelloRequest request = new HelloRequest();
        request.setMessage("Welcome!");

        mockMvc.perform(post("/api/v1/hello")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
} 