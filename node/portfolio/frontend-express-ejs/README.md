# Express.js + EJS Hello World アプリケーション

このプロジェクトは、Express.jsとEJSを使用したシンプルなHello Worldアプリケーションです。

## 必要条件

- Node.js (v14以上)
- npm (v6以上)

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. アプリケーションの起動:
```bash
# 開発モード（ホットリロード付き）
npm run dev

# 本番モード
npm start
```

3. ブラウザでアクセス:
http://localhost:3000

## プロジェクト構造

```
.
├── app.js              # メインアプリケーションファイル
├── package.json        # プロジェクト設定と依存関係
├── views/             # EJSテンプレート
│   └── index.ejs      # メインページのテンプレート
└── public/            # 静的ファイル（CSS、JavaScript、画像など）
```

## 機能

- Express.jsを使用したWebサーバー
- EJSテンプレートエンジンによる動的HTML生成
- レスポンシブデザイン
- 開発用ホットリロード（nodemon）
