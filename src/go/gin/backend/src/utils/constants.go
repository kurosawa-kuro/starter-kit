package utils

// API定数
const (
	// API Version
	APIVersion = "1.0.0"
	
	// Default Messages
	DefaultHelloMessage = "Hello, World!"
	DefaultHealthMessage = "Hello World API is running!"
	
	// Error Messages
	ErrDatabaseConnection = "Database connection failed"
	ErrValidationFailed = "Validation failed"
	ErrInternalServer = "Internal server error"
	ErrNotFound = "Resource not found"
	
	// Success Messages
	SuccessMessageCreated = "Message created successfully"
	SuccessMessageRetrieved = "Message retrieved successfully"
	
	// HTTP Status Messages
	StatusOK = "ok"
	StatusError = "error"
	StatusSuccess = "success"
)

// Database定数
const (
	// Connection Pool Settings
	MaxOpenConns = 25
	MaxIdleConns = 25
	ConnMaxLifetime = 5 // minutes
	
	// Timeout Settings
	DBPingTimeout = 5 // seconds
)

// Environment定数
const (
	// Environment Names
	EnvDevelopment = "development"
	EnvProduction = "production"
	EnvTest = "test"
	
	// Default Values
	DefaultPort = "8080"
	DefaultDBHost = "localhost"
	DefaultDBPort = "5432"
	DefaultDBUser = "sampleuser"
	DefaultDBPass = "samplepass"
	DefaultDBName = "sampledb"
	DefaultJWTSecret = "your_jwt_secret"
) 