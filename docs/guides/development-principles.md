了解しました 👍
`doc/` フォルダを追加して **仕様.md / 設計.md / 禁止.md** を配置した最新版の整理をしました。

---

# 📌 開発共通基本方針

* **環境変数**：`.env` と連携する **config.js** を必須利用
* **プロセス管理**：実行前に必ず前のプロセスを終了
* **ポート番号**

  * フロント：**3000系**
  * バック：**8000系**
  * ミドル：**5000系**
* **Makefile タスク**

  * `setup`：初期セットアップ
  * `dev`：開発サーバ起動
  * `test`：最低限の正常系テスト
  * `stop-port`：指定ポートのプロセス強制終了
* **UIテーマ**：ダーク固定
* **CSS**：Tailwind を採用（必要な場合のみ）

---

# 📂 ディレクトリ構成（最新版）

```
myapp/
├── cmd/
│   └── server/
│       └── index.js             # エントリポイント
├── internal/
│   ├── handler/                 # ルーティング層
│   │   ├── todoHandler.js
│   │   └── categoryHandler.js
│   ├── service/                 # ビジネスロジック層
│   │   ├── todoService.js
│   │   └── categoryService.js
│   ├── repository/              # データアクセス層
│   │   ├── todoRepository.js
│   │   └── categoryRepository.js
│   └── model/                   # モデル定義
│       ├── todoModel.js
│       └── categoryModel.js
├── pkg/
│   ├── prisma.js                # Prismaクライアント初期化
│   ├── logger.js                # ロガー
│   ├── util.js                  # 汎用ユーティリティ
│   └── config.js                # 環境変数・設定まとめ
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   └── port-stop.sh             # ポート強制終了スクリプト
├── test/
│   └── api.http                 # API テスト用（VS Code REST Client / HTTPie 用）
├── doc/
│   ├── 仕様.md                   # 機能仕様書
│   ├── 設計.md                   # 設計方針／アーキテクチャ
│   └── 禁止.md                   # 禁止事項（アンチパターン・NGルール）
├── Makefile
├── .env
├── package.json
└── README.md
```
