#!/bin/bash

# Lambda Batch 関数テストスクリプト

FUNCTION_NAME="${1:-hello-batch}"
PAYLOAD="$2"
if [ -z "$PAYLOAD" ]; then
    PAYLOAD='{}'
fi
RESPONSE_FILE="/tmp/lambda-response-$$.json"

echo "=== Lambda Batch Test ==="
echo "Function: $FUNCTION_NAME"
echo "Payload: $PAYLOAD"
echo ""

# Lambda関数を呼び出し
aws lambda invoke \
    --function-name "$FUNCTION_NAME" \
    --payload "$PAYLOAD" \
    --cli-binary-format raw-in-base64-out \
    --output json \
    "$RESPONSE_FILE" > /tmp/lambda-invoke-result-$$.json 2>&1

INVOKE_STATUS=$?

if [ $INVOKE_STATUS -ne 0 ]; then
    echo "Error: Failed to invoke Lambda function"
    cat /tmp/lambda-invoke-result-$$.json
    rm -f "$RESPONSE_FILE" /tmp/lambda-invoke-result-$$.json
    exit 1
fi

# エラーチェック
FUNCTION_ERROR=$(cat /tmp/lambda-invoke-result-$$.json | jq -r '.FunctionError // empty')
if [ -n "$FUNCTION_ERROR" ]; then
    echo "Function Error: $FUNCTION_ERROR"
fi

# ステータスコード表示
STATUS_CODE=$(cat /tmp/lambda-invoke-result-$$.json | jq -r '.StatusCode')
echo "Status Code: $STATUS_CODE"
echo ""

# レスポンス表示
echo "=== Response ==="
cat "$RESPONSE_FILE" | jq .

# クリーンアップ
rm -f "$RESPONSE_FILE" /tmp/lambda-invoke-result-$$.json
