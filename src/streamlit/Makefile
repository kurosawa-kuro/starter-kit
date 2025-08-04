.PHONY: install run dev clean build test requirements help

# Python settings
PYTHON = python3
PIP = pip3
PYTHONPATH = src

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies using system Python (break system packages)
	$(PIP) install --break-system-packages -r requirements.txt

requirements: ## Update requirements.txt with current installed packages
	$(PIP) freeze > requirements.txt

run: ## Run Streamlit application
	cd $(PYTHONPATH) && PYTHONPATH=. $(PYTHON) -m streamlit run app.py

dev: ## Run Streamlit application in development mode with auto-reload
	cd $(PYTHONPATH) && PYTHONPATH=. $(PYTHON) -m streamlit run app.py --server.runOnSave true

build: ## Check if the application can be imported (basic build check)
	cd $(PYTHONPATH) && PYTHONPATH=. $(PYTHON) -c "import app; print('✅ Application can be imported successfully')"

test: ## Run basic tests (check if app can be imported and run)
	cd $(PYTHONPATH) && PYTHONPATH=. $(PYTHON) -c "import streamlit as st; import app; print('✅ All imports successful')"

clean: ## Clean cache and temporary files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .streamlit

# Docker commands (optional)
docker-build: ## Build Docker image
	docker build -t streamlit-todo-app .

docker-run: ## Run application in Docker container
	docker run -p 8501:8501 streamlit-todo-app

# Development helpers
format: ## Format Python code (requires black)
	$(PYTHON) -m black $(PYTHONPATH)/

lint: ## Lint Python code (requires flake8)
	$(PYTHON) -m flake8 $(PYTHONPATH)/

setup-dev: ## Setup development environment with additional tools
	$(PIP) install --break-system-packages black flake8 pytest

# Quick start
start: install run ## Quick start: install dependencies and run the application