# 🚀 JavaScript + Express スタータープロジェクトドキュメント

（Docker Compose + PostgreSQL + Swagger 対応／WSL互換）

## 🎯 プロジェクト概要

このリポジトリは、**JavaScript + Express** を用いた REST API 開発のスタータープロジェクトです。
テーマは `hello-world`。再現性を重視した構成で、以下の機能を提供します：

* 再現性の高い Docker Compose 構成（PostgreSQL + pgAdmin）
* SwaggerによるAPI仕様書自動生成
* テストコード（Jest + Supertest）による基本動作確認
* WSL環境におけるPostgreSQL競合対策済み

---

## 📁 ディレクトリ構成

```
backend/
├── docker-compose.yml             # コンテナ定義（Node.js + PostgreSQL + pgAdmin）
├── Makefile                       # ビルド／テスト／Swagger生成などの開発補助コマンド
├── .env                           # 実行時の環境変数（PORT, DB, JWTなど）
├── .env.sample                    # 環境変数テンプレート（共有／バージョン管理用）
├── package.json                   # Node.js依存関係管理
├── package-lock.json              # 依存関係ロックファイル
├── app.js                         # エントリーポイント（Expressアプリケーション）

├── config/                        # 設定管理（DB接続／env読込など）
├── controllers/                   # 各エンドポイントのコントローラー定義
├── routes/                        # Expressルーティング定義
├── middleware/                    # カスタムミドルウェア
├── docs/                          # Swagger JSON/YAML（swagger-jsdocで自動生成）

├── test/                          # テスト関連
│   ├── app.test.js                # エンドポイント単体テスト
│   └── api.http                   # REST Client／Thunder Client用API定義ファイル

├── db/                            # データベース関連（初期スキーマ等）
│   └── init.sql                   # 任意：初期テーブル定義など

└── script/                        # スクリプト集
    └── kill-backend-port.sh      # ポート競合時のプロセスkillユーティリティ

```


---

## 🌐 エンドポイント仕様

| メソッド | パス             | 内容                 |
| ---- | -------------- | ------------------ |
| GET  | `/hello-world` | 「Hello, World!」を返す |
| POST | `/hello-world` | JSONを受け取り、そのまま返す   |
| GET  | `/health`      | ヘルスチェック用（常時200）    |

---

## 🧪 テスト

* Jest + Supertest によるハンドラーテスト
* `/hello-world`, `/health` のレスポンス検証を実装済み

---

## 🐳 Docker構成（PostgreSQLポート競合対策済み）

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: hello_backend
    ports:
      - "8080:8080"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  db:
    image: postgres:15
    container_name: hello_pg
    environment:
      POSTGRES_USER: sampleuser
      POSTGRES_PASSWORD: samplepass
      POSTGRES_DB: sampledb
    ports:
      - "15432:5432"  # WSL PostgreSQLと競合しないよう5432→15432に変更
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: hello_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: adminpass
    ports:
      - "5050:80"
    depends_on:
      - db

volumes:
  pgdata:
```

---

## 📜 .env サンプル（backend/.env）

```env
PORT=8080
DB_HOST=db
DB_PORT=5432
DB_USER=sampleuser
DB_PASSWORD=samplepass
DB_NAME=sampledb
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

※ Dockerネットワーク内で `db:5432` に接続するため `.env` 側は5432のままでOK

---

## 🧾 Swagger仕様（自動生成）

* swagger-jsdoc + swagger-ui-express で `/docs` にAPI定義ファイルを自動生成
* 各コントローラー関数の上にSwaggerコメントを追加

アクセス先：

```
http://localhost:8080/api-docs
```

---

## 🔧 起動手順

```bash
git clone https://github.com/your-org/starter-project.git
cd starter-project
docker-compose up --build
```

ブラウザで以下にアクセス：

* API確認 → [http://localhost:8080/hello-world](http://localhost:8080/hello-world)
* Swagger UI → [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
* pgAdmin → [http://localhost:5050（ID](http://localhost:5050（ID): [admin@example.com](mailto:admin@example.com) / PASS: adminpass）

---

## ✅ 推奨利用ケース

| 利用目的         | 利用方法                        |
| ------------ | --------------------------- |
| JavaScript + Express 初学者 | ルーティング／コントローラー構成やSwagger連携の学習 |
| チーム共有テンプレ    | Docker Composeでローカル再現性を担保   |
| PoC（検証）      | DBあり・なしの両構成を柔軟に試せる          |

---

## 🧩 バージョン展開方針

| バージョン | 構成内容                                       |
| ----- | ------------------------------------------ |
| `v1`  | GET/POST API + Health Check（DBなし・Dockerなし） |
| `v2`  | Docker Compose（PostgreSQL + pgAdmin）を追加    |
| `v3`  | Swagger自動ドキュメント連携                          |
| `v4`  | CI/CD・マイグレーション・JWT認証・ヘルス/メトリクス強化           |

---

## 🎯 注意（WSL環境ユーザー向け）

WSL環境に直接PostgreSQLが入っている場合、**ホスト5432ポートが既に使用中**のため、
`docker-compose.yml` の PostgreSQLサービスを `15432:5432` に変更しています。

pgAdmin等で接続する際は以下を指定：

```
Host: localhost
Port: 15432
User: sampleuser
Password: samplepass
DB: sampledb
```

---

## 🔚 結論

このスターター構成は以下を意識して設計されています：

* **「誰が実行しても同じ結果になる」こと**
* **「現実的な業務構成にスムーズに移行できる」こと**
* **「PoC〜実運用まで発展しやすい」こと**

JavaScript + Express + Docker + PostgreSQL + Swagger の構成で
**即座に実装・テスト・可視化・拡張**が可能なプロジェクトテンプレートです。

---

📦 実装コード一式も自動生成可能です。必要であればご依頼ください。
併せて、Makefile、GitHub Actions、SQLマイグレーション自動化にも対応可能です。
