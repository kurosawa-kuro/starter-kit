.PHONY: build run generate clean

build:
	go build -o bin/server cmd/server/main.go

run:
	go run cmd/server/main.go

generate:
	sqlboiler sqlite3

clean:
	rm -f bin/server
	rm -rf internal/models/*

