.PHONY: build run generate clean test

build:
	go build -o bin/server cmd/server/main.go

run:
	go run cmd/server/main.go

generate:
	sqlboiler sqlite3

test:
	go test -v ./internal/controllers/... ./internal/services/... ./internal/repositories/... ./internal/testutils/...

clean:
	rm -f bin/server
	rm -rf internal/models/*

