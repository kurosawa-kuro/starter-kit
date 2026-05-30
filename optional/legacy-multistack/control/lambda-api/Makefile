.PHONY: install build zip deploy test clean

# Dependencies
install:
	npm install

# Build
build:
	npm run build

# Package
zip:
	npm run zip

# Deploy (build + zip + update)
deploy:
	npm run deploy

# Test Lambda connectivity
test:
	./script/test-lambda.sh

# Clean build artifacts
clean:
	rm -rf dist lambda.zip
