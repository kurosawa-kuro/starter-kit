.PHONY: install build zip deploy update test clean invoke create logs delete env-set env-get

# 設定
FUNCTION_NAME := hello-batch
ROLE_NAME := lambda-execution-role
RUNTIME := nodejs20.x
TIMEOUT := 300
MEMORY := 256

# 依存関係インストール
install:
	npm install

# TypeScriptビルド
build:
	npm run build

# デプロイパッケージ作成
zip:
	npm run zip

# Lambda関数更新
update:
	npm run update

# ビルド → zip → デプロイ
deploy:
	npm run deploy

# Lambda関数テスト実行
test:
	./script/test-lambda.sh

# カスタムペイロードでテスト
# 使用例: make invoke PAYLOAD='{"key":"value"}'
invoke:
	@if [ -z "$(PAYLOAD)" ]; then \
		echo "Usage: make invoke PAYLOAD='{\"key\":\"value\"}'"; \
		exit 1; \
	fi
	./script/test-lambda.sh $(FUNCTION_NAME) '$(PAYLOAD)'

# Lambda関数を新規作成
create: build zip
	@ACCOUNT_ID=$$(aws sts get-caller-identity --query Account --output text); \
	aws lambda create-function \
		--function-name $(FUNCTION_NAME) \
		--runtime $(RUNTIME) \
		--handler index.handler \
		--role arn:aws:iam::$$ACCOUNT_ID:role/$(ROLE_NAME) \
		--zip-file fileb://lambda.zip \
		--timeout $(TIMEOUT) \
		--memory-size $(MEMORY)

# Lambda関数を削除
delete:
	aws lambda delete-function --function-name $(FUNCTION_NAME)

# CloudWatch Logsを表示
logs:
	aws logs tail /aws/lambda/$(FUNCTION_NAME) --follow

# Lambda環境変数を設定
# 使用例: make env-set MONGODB_URI='mongodb+srv://...'
env-set:
	@if [ -z "$(MONGODB_URI)" ]; then \
		echo "Usage: make env-set MONGODB_URI='mongodb+srv://...'"; \
		exit 1; \
	fi
	aws lambda update-function-configuration \
		--function-name $(FUNCTION_NAME) \
		--environment "Variables={MONGODB_URI=$(MONGODB_URI)}"

# Lambda環境変数を確認
env-get:
	aws lambda get-function-configuration \
		--function-name $(FUNCTION_NAME) \
		--query 'Environment.Variables' \
		--output json

# ビルド成果物削除
clean:
	rm -rf dist lambda.zip node_modules
