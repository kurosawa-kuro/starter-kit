# Streamlit Todo App

A simple and interactive Todo application built with Streamlit, featuring category management, filtering, and statistics.

## Features

- ✏️ Add new todos with titles
- 🏷️ Category management (create and assign categories to todos)
- 🔍 Filter todos by status (all, completed, pending) and category
- 📊 Real-time statistics display
- 🎯 Session-based state management
- 🔧 Debug information panel

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Streamlit package

## Installation & Setup

### Method 1: Using Makefile (Recommended)

```bash
# Clone or navigate to the project directory
cd /path/to/streamlit

# Quick start - install dependencies and run the app
make start

# Or step by step:
# 1. Install dependencies
make install

# 2. Run the application
make run
```

### Method 2: Manual Setup

```bash
# 1. Install dependencies
pip3 install -r requirements.txt

# 2. Run the application
cd src && PYTHONPATH=. python3 -m streamlit run app.py
```

## Running the Application

### Development Mode

```bash
# Run with auto-reload enabled
make dev

# Or manually:
cd src && PYTHONPATH=. python3 -m streamlit run app.py --server.runOnSave true
```

### Production Mode

```bash
# Standard run
make run

# Or manually:
cd src && PYTHONPATH=. python3 -m streamlit run app.py
```

The application will be available at: http://localhost:8501

## Available Make Commands

```bash
make help           # Show all available commands
make install        # Install dependencies using system Python
make run            # Run Streamlit application
make dev            # Run with auto-reload enabled
make build          # Basic build check (test imports)
make test           # Run basic tests
make clean          # Clean cache and temporary files
make requirements   # Update requirements.txt
make setup-dev      # Setup development environment with tools
make format         # Format code with black (requires setup-dev)
make lint           # Lint code with flake8 (requires setup-dev)
```

## Usage

1. **Adding Categories**: Use the category management section to create categories for organizing your todos
2. **Adding Todos**: Enter a todo title and optionally assign categories
3. **Filtering**: Use the filter section to view todos by status and/or category
4. **Statistics**: View real-time statistics of your todo progress
5. **Debug**: Expand the debug section to view internal application state

## Application Structure

```
src/streamlit/
├── src/                # Source code directory
│   ├── __init__.py     # Package initialization
│   ├── app.py          # Main Streamlit UI application
│   └── service.py      # Business logic service layer
├── requirements.txt    # Python dependencies
├── Makefile           # Build and run commands
└── README.md          # This file
```

### Architecture

The application follows a clean separation of concerns:

- **UI Layer** (`src/app.py`): Streamlit interface and user interaction handling
- **Business Logic** (`src/service.py`): Todo management, filtering, and data operations
- **Service Pattern**: `TodoService` class encapsulates all business logic
- **Session Management**: Streamlit session state manages UI filters and service instance

## Dependencies

- `streamlit>=1.28.0` - Web application framework

## Development

### Setting up Development Environment

```bash
# Install development tools
make setup-dev

# Format code
make format

# Lint code  
make lint
```

### Adding New Features

1. The application uses Streamlit's session state for data persistence
2. Main functions are organized by functionality (todos, categories, display, etc.)
3. Follow the existing code structure when adding new features
4. Business logic should be added to `TodoService` class
5. UI components should remain in `app.py`

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 8501 is busy, Streamlit will automatically try the next available port
2. **Import errors**: Ensure all dependencies are installed with `make install`
3. **Module not found**: Make sure you're running from the correct directory with proper PYTHONPATH
4. **Permission errors**: You may need to use `sudo` for system-wide package installation

### Logs and Debugging

- Use the built-in debug panel in the application to view session state
- Check terminal output for Streamlit server logs
- Use `make test` to verify basic functionality

## Docker Support (Optional)

```bash
# Build Docker image
make docker-build

# Run in Docker container
make docker-run
```

## Port Configuration

- Default port: 8501
- Application will automatically find next available port if 8501 is busy
- Access via: http://localhost:8501 (or shown port in terminal)

## Contributing

1. Follow the existing code structure and naming conventions
2. Test your changes with `make test`
3. Format code with `make format` before committing
4. Update documentation as needed
5. Keep UI and business logic separated

## Notes

- This project uses system Python directly (no virtual environment)
- Dependencies are installed globally or user-wide
- Make sure you have the required Python version and packages installed