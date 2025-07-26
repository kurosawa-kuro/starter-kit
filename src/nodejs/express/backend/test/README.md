# テストコード リファクタリング

## 概要

スタータープロジェクトのテストコードをリファクタリングし、保守性と可読性を向上させました。

## 新しいテスト構造

```
test/
├── setup/
│   ├── testSetup.js          # 統合テストセットアップ
│   └── testConfig.js         # テスト設定
├── utils/
│   ├── testDatabase.js       # テスト用DB接続
│   ├── testHelpers.js        # テストヘルパー関数
│   ├── testData.js           # テストデータ管理
│   └── testSequencer.js      # テスト実行順序管理
├── integration/
│   ├── helloWorld.integration.test.js  # 統合テスト
│   └── health.integration.test.js      # ヘルスチェック統合テスト
├── unit/
│   ├── helloWorld.unit.test.js         # ユニットテスト
│   └── services.unit.test.js           # サービスユニットテスト
├── jest.config.js            # Jest設定
└── README.md                 # このファイル
```

## 主な改善点

### 1. 設定の一元化
- `testConfig.js`で環境変数とテスト設定を一元管理
- 重複した設定ファイルを削除
- 環境変数の重複設定を解消

### 2. テストヘルパーの導入
- `TestHelpers`クラスで共通のテスト処理を提供
- APIリクエスト、レスポンス検証、データベース操作のヘルパー関数
- テストコードの重複を削減

### 3. テストデータの管理
- `HelloWorldTestData`、`DatabaseTestData`、`ExpectedResponseData`クラス
- ファクトリーパターンでテストデータを生成
- テストシナリオのデータ駆動テスト

### 4. データベース接続の改善
- `TestDatabase`クラスで接続管理を改善
- リトライ機能とエラーハンドリングの強化
- テストデータのクリーンアップ機能

### 5. テストの分類
- **統合テスト**: データベース連動のAPIテスト
- **ユニットテスト**: モックを使用したビジネスロジックテスト
- **セットアップ**: テスト環境の初期化

## 使用方法

### テストの実行

```bash
# 全テストを実行
npm test

# 統合テストのみ実行
npm test -- --testPathPattern=integration

# ユニットテストのみ実行
npm test -- --testPathPattern=unit

# カバレッジ付きで実行
npm test -- --coverage

# 特定のテストファイルを実行
npm test -- helloWorld.integration.test.js
```

### テストヘルパーの使用例

```javascript
// APIリクエスト
const response = await TestHelpers.get(app, '/api/hello-world');

// レスポンス検証
TestHelpers.validateSuccessResponse(response);
TestHelpers.validateHelloWorldMessage(response, 'TestUser');

// テストデータ作成
const testData = HelloWorldTestData.createBasicMessage('TestUser');
```

### データベーステスト

```javascript
// テストデータの挿入
await testDatabase.insertTestData(testData);

// テストデータの取得
const result = await testDatabase.getTestData('TestUser');

// テストデータのクリーンアップ
await TestHelpers.cleanupTestData(testDatabase);
```

## テストカバレッジ

- **目標**: 80%以上のカバレッジ
- **対象**: ソースコード（設定ファイルとエントリーポイントを除く）
- **レポート**: HTML、LCOV、テキスト形式

## 環境設定

### 必要な環境変数

```bash
# テスト用データベース設定
DB_HOST=localhost
DB_PORT=15433
DB_USER=sampleuser
DB_PASSWORD=samplepass
DB_NAME=sampledb_test

# テスト設定
NODE_ENV=test
MOCK_MODE=false
```

### データベースの準備

```sql
-- テスト用データベースの作成
CREATE DATABASE sampledb_test;

-- テスト用ユーザーの作成
CREATE USER sampleuser WITH PASSWORD 'samplepass';
GRANT ALL PRIVILEGES ON DATABASE sampledb_test TO sampleuser;
```

## ベストプラクティス

### 1. テストの独立性
- 各テストは独立して実行可能
- テストデータは各テストでクリーンアップ
- 外部依存はモックで制御

### 2. テストの可読性
- 説明的なテスト名
- テストデータのファクトリーパターン
- ヘルパー関数の活用

### 3. パフォーマンス
- 並列実行の最適化
- データベース接続の再利用
- 効率的なテストデータ管理

### 4. エラーハンドリング
- データベース接続エラーの適切な処理
- モックモードへの自動フォールバック
- 詳細なエラーメッセージ

## トラブルシューティング

### データベース接続エラー

```bash
# データベースが起動しているか確認
docker ps | grep postgres

# 接続設定を確認
echo $DB_HOST $DB_PORT $DB_USER $DB_NAME
```

### テストが失敗する場合

```bash
# テストデータベースをリセット
npm run test:reset-db

# モックモードでテスト実行
MOCK_MODE=true npm test
```

### パフォーマンスの問題

```bash
# 並列実行数を調整
npm test -- --maxWorkers=2

# タイムアウトを延長
npm test -- --testTimeout=30000
```

## 今後の改善予定

1. **E2Eテストの追加**: Playwrightを使用したエンドツーエンドテスト
2. **パフォーマンステスト**: 負荷テストとベンチマーク
3. **セキュリティテスト**: 脆弱性スキャンとペネトレーションテスト
4. **CI/CD統合**: GitHub Actionsでの自動テスト実行 