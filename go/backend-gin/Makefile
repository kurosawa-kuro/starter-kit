.PHONY: build run generate clean test test-coverage

build:
	go build -o bin/server cmd/server/main.go

run:
	go run cmd/server/main.go

generate:
	sqlboiler sqlite3

test:
	go test -v ./internal/controllers/... ./internal/services/... ./internal/repositories/... ./internal/testutils/...

test-coverage:
	go test -v -coverprofile=coverage.out ./internal/controllers/... ./internal/services/... ./internal/repositories/... ./internal/testutils/...
	go tool cover -html=coverage.out -o coverage.html
	go tool cover -func=coverage.out

clean:
	rm -f bin/server coverage.out coverage.html
	rm -rf internal/models/*

