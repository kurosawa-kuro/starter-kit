#!/bin/bash

# Lambda function connectivity test script

FUNCTION_NAME="${1:-hello}"
PAYLOAD="${2:-{}}"
RESPONSE_FILE="/tmp/lambda-response-$$.json"

echo "=== Lambda Connectivity Test ==="
echo "Function: $FUNCTION_NAME"
echo "Payload: $PAYLOAD"
echo ""

# Invoke Lambda function
echo "Invoking Lambda..."
RESULT=$(aws lambda invoke \
  --function-name "$FUNCTION_NAME" \
  --payload "$PAYLOAD" \
  --cli-binary-format raw-in-base64-out \
  "$RESPONSE_FILE" 2>&1)

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "[FAIL] Lambda invocation failed"
  echo "$RESULT"
  rm -f "$RESPONSE_FILE"
  exit 1
fi

# Check for function error
FUNCTION_ERROR=$(echo "$RESULT" | grep -o '"FunctionError": "[^"]*"' | cut -d'"' -f4)

if [ -n "$FUNCTION_ERROR" ]; then
  echo "[FAIL] Function error: $FUNCTION_ERROR"
  echo "Response:"
  cat "$RESPONSE_FILE"
  rm -f "$RESPONSE_FILE"
  exit 1
fi

# Show status code
STATUS_CODE=$(echo "$RESULT" | grep -o '"StatusCode": [0-9]*' | grep -o '[0-9]*')
echo "Status Code: $STATUS_CODE"

# Show response
echo ""
echo "Response:"
cat "$RESPONSE_FILE"
echo ""

# Cleanup
rm -f "$RESPONSE_FILE"

echo ""
echo "[OK] Lambda connectivity test passed"
