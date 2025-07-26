# Spring Boot Hello World API

Spring Bootを使用したシンプルなHello World APIです。

## 概要

このプロジェクトは、Spring Boot 3.2.0を使用して構築されたRESTful APIです。基本的なHello World機能を提供し、Spring Bootの基本的な機能を学習するためのサンプルプロジェクトとして設計されています。

## 技術スタック

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Maven**: プロジェクト管理
- **Spring Web**: RESTful API
- **Spring Validation**: 入力検証
- **Spring Actuator**: ヘルスチェック・監視
- **Jackson**: JSON処理
- **JUnit 5**: テストフレームワーク

## プロジェクト構造

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── helloworld/
│   │               ├── HelloWorldApplication.java
│   │               ├── controller/
│   │               │   └── HelloWorldController.java
│   │               ├── model/
│   │               │   ├── HelloRequest.java
│   │               │   └── HelloResponse.java
│   │               └── service/
│   │                   └── HelloWorldService.java
│   └── resources/
│       └── application.yml
└── test/
    └── java/
        └── com/
            └── example/
                └── helloworld/
                    ├── HelloWorldApplicationTests.java
                    └── controller/
                        └── HelloWorldControllerTest.java
```

## セットアップ

### 前提条件

- Java 17以上
- Maven 3.6以上

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd my-study/starter-project/jvm/java/backend
```

2. 依存関係をインストール
```bash
mvn clean install
```

3. アプリケーションを起動
```bash
mvn spring-boot:run
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
mvn test

# 特定のテストクラスを実行
mvn test -Dtest=HelloWorldControllerTest

# テストレポートを生成
mvn test jacoco:report
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
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### コードフォーマット

```bash
# コードフォーマット
mvn spring-javaformat:apply
```

### 依存関係の更新

```bash
# 依存関係の更新確認
mvn versions:display-dependency-updates
```

## デプロイ

### JARファイルの作成

```bash
mvn clean package
```

生成されたJARファイルは `target/helloworld-api-1.0.0.jar` です。

### 実行

```bash
java -jar target/helloworld-api-1.0.0.jar
```

## 監視・ログ

### Actuatorエンドポイント

- `/actuator/health`: ヘルスチェック
- `/actuator/info`: アプリケーション情報
- `/actuator/metrics`: メトリクス

### ログ

ログファイルは `logs/helloworld-api.log` に出力されます。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成 