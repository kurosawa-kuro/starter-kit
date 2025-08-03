# Starter Kit - マルチ技術スタック開発テンプレート

このプロジェクトは、様々な技術スタックを使用したバックエンド・フロントエンド開発のスターターテンプレート集です。

## 📁 プロジェクト構造

```
src/
├── go/
│   ├── chi/backend/         # Go + Chi REST API
│   └── gin/backend/         # Go + Gin REST API
├── jvm/
│   ├── java/backend/        # Java + Spring Boot
│   └── kotlin/backend/      # Kotlin + Spring Boot
├── nodejs/
│   ├── express/backend/     # JavaScript + Express.js
│   ├── hono/backend/        # TypeScript + Hono
│   ├── nextjs/frontend/     # Next.js (React)
│   ├── nuxt/frontend/       # Nuxt.js (Vue)
│   └── vue/frontend/        # Vue.js + Vite
└── python/
    └── fastapi/             # Python + FastAPI
```

## 🚀 利用可能な技術スタック

### バックエンド API

- **Go + Chi**: 軽量で高速なHTTPルーター
- **Go + Gin**: 人気の高いGoウェブフレームワーク
- **Java + Spring Boot**: エンタープライズ級のJavaフレームワーク
- **Kotlin + Spring Boot**: Kotlinを使用したモダンなSpring Boot
- **Node.js + Express**: 定番のJavaScriptウェブフレームワーク
- **TypeScript + Hono**: 軽量で高速なTypeScriptフレームワーク
- **Python + FastAPI**: 高性能なPython非同期フレームワーク

### フロントエンド

- **Vue.js + Vite**: モダンなVue開発環境
- **Nuxt.js**: Vue.jsのフルスタックフレームワーク
- **Next.js**: React.jsのフルスタックフレームワーク

## 🛠️ クイックスタート

### フロントエンド

#### Vue.js プロジェクト
```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install
npm run dev
```

#### Nuxt.js プロジェクト
```bash
npx nuxi@latest init frontend
cd frontend
npm install
npm run dev
```

#### Next.js プロジェクト
```bash
npx create-next-app@latest frontend
cd frontend
npm run dev
```

### バックエンド

#### Go プロジェクト
```bash
# Go modules初期化
go mod init backend

# Ginフレームワーク
go get -u github.com/gin-gonic/gin

# または Chiフレームワーク
go get -u github.com/go-chi/chi/v5
```

#### Hono プロジェクト
```bash
npm create hono@latest backend
cd backend
npm install
npm run dev
```

#### Python FastAPI
```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

## 📝 各プロジェクトの詳細

詳細な開発コマンドや設定については、各プロジェクトディレクトリ内の`Makefile`やpackage.jsonを参照してください。

多くのプロジェクトには以下が含まれています：
- ホットリロード開発環境
- テスト設定
- Docker Compose設定
- API仕様書（Swagger/OpenAPI）
- 本格的なプロジェクト構造

## 🔧 開発環境

このスターターキットは以下の開発環境を想定しています：
- Node.js 18+
- Go 1.19+
- Python 3.8+
- Java 11+
- Docker & Docker Compose

より詳しい情報は`CLAUDE.md`ファイルを参照してください。