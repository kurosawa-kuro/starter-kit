#!/bin/bash

# Kill process running on port 8080
lsof -ti:8080 | xargs kill -9 