# Spring Boot Hello World API (Kotlin)

Spring Bootを使用したシンプルなHello World APIです（Kotlin版）。

## 概要

このプロジェクトは、Spring Boot 3.2.0とKotlinを使用して構築されたRESTful APIです。基本的なHello World機能を提供し、Spring BootとKotlinの基本的な機能を学習するためのサンプルプロジェクトとして設計されています。

## 技術スタック

- **Kotlin**: 1.9.20
- **Java**: 17
- **Spring Boot**: 3.2.0
- **Gradle**: プロジェクト管理
- **Spring Web**: RESTful API
- **Spring Validation**: 入力検証
- **Spring Actuator**: ヘルスチェック・監視
- **Jackson**: JSON処理
- **JUnit 5**: テストフレームワーク

## プロジェクト構造

```
src/
├── main/
│   ├── kotlin/
│   │   └── com/
│   │       └── example/
│   │           └── helloworld/
│   │               ├── HelloWorldApplication.kt
│   │               ├── controller/
│   │               │   └── HelloWorldController.kt
│   │               ├── model/
│   │               │   ├── HelloRequest.kt
│   │               │   └── HelloResponse.kt
│   │               └── service/
│   │                   └── HelloWorldService.kt
│   └── resources/
│       └── application.yml
└── test/
    └── kotlin/
        └── com/
            └── example/
                └── helloworld/
                    ├── HelloWorldApplicationTests.kt
                    └── controller/
                        └── HelloWorldControllerTest.kt
```

## セットアップ

### 前提条件

- Java 17以上
- Gradle（ラッパーを使用）

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd my-study/starter-project/jvm/kotlin/backend
```

2. 依存関係をインストール
```bash
./gradlew dependencies
```

3. アプリケーションを起動
```bash
./gradlew bootRun
```

アプリケーションは `http://localhost:8080` で起動します。

## API エンドポイント

### 1. 基本的なHello Worldメッセージ

**GET** `/api/v1/hello`

基本的なHello Worldメッセージを取得します。

**レスポンス例:**
```json
{
  "message": "Hello, World!",
  "timestamp": "2024-01-01 12:00:00",
  "status": "success"
}
```

### 2. パーソナライズされたHelloメッセージ

**GET** `/api/v1/hello/{name}`

指定された名前でパーソナライズされたメッセージを取得します。

**パラメータ:**
- `name` (path): 挨拶する名前

**レスポンス例:**
```json
{
  "message": "Hello, John!",
  "timestamp": "2024-01-01 12:00:00",
  "status": "success"
}
```

### 3. カスタムHelloメッセージの作成

**POST** `/api/v1/hello`

カスタムメッセージを含むパーソナライズされた挨拶を作成します。

**リクエストボディ:**
```json
{
  "name": "Alice",
  "message": "Welcome to our API!"
}
```

**レスポンス例:**
```json
{
  "message": "Hello, Alice! Welcome to our API!",
  "timestamp": "2024-01-01 12:00:00",
  "status": "success"
}
```

### 4. ヘルスチェック

**GET** `/api/v1/hello/health`

APIの健全性を確認します。

**レスポンス例:**
```json
{
  "message": "Hello World API is running!",
  "timestamp": "2024-01-01 12:00:00",
  "status": "healthy"
}
```

## テスト

### テストの実行

```bash
# すべてのテストを実行
./gradlew test

# 特定のテストクラスを実行
./gradlew test --tests HelloWorldControllerTest

# テストレポートを生成
./gradlew test jacocoTestReport
```

### テストカバレッジ

プロジェクトには以下のテストが含まれています：

- **統合テスト**: アプリケーションコンテキストの読み込みテスト
- **コントローラーテスト**: RESTエンドポイントのテスト
- **バリデーションテスト**: 入力検証のテスト

## 設定

### アプリケーション設定

`src/main/resources/application.yml` で以下の設定が可能です：

- **サーバーポート**: デフォルト8080
- **ログレベル**: INFO
- **Actuatorエンドポイント**: ヘルスチェック、メトリクス
- **Jackson設定**: JSON処理の設定

### 環境変数

以下の環境変数で設定をオーバーライドできます：

- `SERVER_PORT`: サーバーポート
- `SPRING_PROFILES_ACTIVE`: アクティブプロファイル

## 開発

### 開発サーバーの起動

```bash
# 開発モードで起動（ホットリロード）
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### コードフォーマット

```bash
# コードフォーマット
./gradlew ktlintFormat
```

### 依存関係の更新

```bash
# 依存関係の更新確認
./gradlew dependencyUpdates
```

## デプロイ

### JARファイルの作成

```bash
./gradlew bootJar
```

生成されたJARファイルは `build/libs/backend-1.0.0.jar` です。

### 実行

```bash
java -jar build/libs/backend-1.0.0.jar
```

## 監視・ログ

### Actuatorエンドポイント

- `/actuator/health`: ヘルスチェック
- `/actuator/info`: アプリケーション情報
- `/actuator/metrics`: メトリクス

### ログ

ログファイルは `logs/helloworld-api-kotlin.log` に出力されます。

## Makefileコマンド

プロジェクトには便利なMakefileコマンドが含まれています：

```bash
# ヘルプ表示
make help

# ビルド
make build

# 実行
make run

# テスト
make test

# クリーン
make clean

# パッケージ作成
make package

# 開発サーバー起動
make dev-run

# プロジェクト情報表示
make info
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成 