了解しました。
「ログイン不要の個人用開発ユーティリティ」を Next.js(App Router) + TypeScript で作る前提で、仕様を一度きれいに整理します。

---

## 1. アプリ全体コンセプト

* 用途: ローカル or 自分専用環境で使う「開発者ユーティリティ」

* ログイン / 認証なし

* 主な機能

  1. `.env` を含む実行環境の環境変数を可視化（シークレットはマスク表示）
  2. MongoDB Atlas への接続確認（Node.js MongoDB Driver 利用）

     * ボタンクリックで接続テスト
     * API 経由でもテスト可能

* UI と API の両方から機能にアクセス可能

* 「Dashboard」という言葉は避け、「ツール一覧」や「Utility Home」的なトーン

---

## 2. ルーティング構成（App Router）

```text
/app
  ├─ layout.tsx
  ├─ page.tsx              # Top: ツール一覧
  ├─ env
  │   └─ page.tsx          # 環境変数可視化画面
  ├─ mongo
  │   └─ page.tsx          # MongoDB 接続確認画面
  └─ api
      ├─ env
      │   └─ route.ts      # GET /api/env
      └─ mongo-test
          └─ route.ts      # POST /api/mongo-test
/lib
  ├─ env.ts                # 環境変数ユーティリティ
  ├─ mongoClient.ts        # MongoDB クライアントラッパ
  └─ types.ts              # 共通型定義
/components
  ├─ ToolCard.tsx
  ├─ EnvTable.tsx
  ├─ SecretValue.tsx
  └─ MongoStatusCard.tsx
```

---

## 3. 画面仕様

### 3.1 `/` Top（ツール一覧）

**目的**
アプリの入り口として、提供しているユーティリティをカードで一覧表示。

**UI イメージ**

* タイトル: `Dev Utility Starter`
* サブタイトル: `ローカル環境 / 個人用の開発ユーティリティ集`
* カード 2 枚:

  * 「環境変数ビューア」

    * 説明: `.env` を含む環境変数の一覧、シークレットはマスク表示
    * ボタン: 「開く」 → `/env`
  * 「MongoDB Atlas 接続チェック」

    * 説明: `MONGODB_URI` を使った接続テスト
    * ボタン: 「開く」 → `/mongo`

ログイン関連の要素は一切なし。
「Dashboard」ではなく「ツール一覧」や「ユーティリティ」として扱う。

---

### 3.2 `/env` 環境変数可視化

**目的**
`process.env` を UI から安全に確認する。シークレットはマスク。

**表示項目（テーブル）**

| カラム            | 内容                                             |
| -------------- | ---------------------------------------------- |
| Key            | 環境変数名（例: `MONGODB_URI`）                        |
| Value (masked) | マスク済み値（例: `mongodb+srv://user:***@cluster...`） |
| Secret?        | シークレット判定（yes/no, アイコン）                         |
| Source         | `process.env` / 将来拡張用（例: `NEXT_RUNTIME` など）    |
| Actions        | 「コピー」「表示切り替え」など（個人利用前提であればオプション）               |

**マスク仕様（例）**

* 基本のルール:

  * 長さが 6 文字以上: 先頭 4 文字 + `****` + 末尾 2 文字
  * 短い場合: 全部 `****`
* `isSecret` 判定

  * キー名に以下が含まれる場合: `SECRET`, `KEY`, `TOKEN`, `PASS`, `PWD`, `URI`
  * または allowlist/denylist で制御

**UI 補助**

* 検索ボックス: key でフィルタ
* 「シークレット以外のみ表示」トグル
* 「NEXT_PUBLIC_ のみ表示」トグル

**サーバー側実装イメージ**

* `/api/env` から取得した JSON を表示するクライアントコンポーネント
* テーブル自体は client component（検索・フィルタのため）

---

### 3.3 `/mongo` MongoDB Atlas 接続確認

**目的**
MongoDB Atlas への接続可否を一発で確認する。

**前提**

* `MONGODB_URI` … 接続文字列
* `MONGODB_DB` … デフォルト DB 名（任意）

**UI 要素**

* 「現在の設定」カード:

  * `MONGODB_URI`：`mongodb+srv://...`（マスク表示）
  * `MONGODB_DB`：テキスト表示
* 「接続テスト」カード:

  * ボタン: `接続テストを実行`
  * 実行中はローディングインジケータ
  * 結果表示:

    * 成功: 「接続 OK」「応答時間: XX ms」「サーバーバージョン: x.y.z」
    * 失敗: 「接続 NG」「エラー種別」「メッセージ（サニタイズ）」
* 履歴（任意実装）

  * クライアント側で直近 N 件を保持（localStorage）

**クライアント動作**

* ボタン押下 → `fetch('/api/mongo-test', { method: 'POST' })`
* レスポンス JSON を UI に表示

---

## 4. API 仕様

### 4.1 `GET /api/env`

**役割**
環境変数の一覧を JSON で返す。
実際の値は「マスク済み値のみ」。生の値を返さない設計も選択可能。

**Request**

* メソッド: `GET`
* クエリパラメータ（任意・将来用）

  * `q`: key の部分一致検索用
  * `includeSystem`: OS 系を含めるかどうか etc.

**Response (例)**

```json
{
  "variables": [
    {
      "key": "MONGODB_URI",
      "valueMasked": "mongodb+srv://use****rd@cluster0.****",
      "isSecret": true,
      "source": "process.env"
    },
    {
      "key": "NEXT_PUBLIC_API_BASE_URL",
      "valueMasked": "https://ap****.example.com",
      "isSecret": false,
      "source": "process.env"
    }
  ]
}
```

**型定義例**

```ts
// lib/types.ts
export type EnvVariable = {
  key: string;
  valueMasked: string;
  isSecret: boolean;
  source: 'process.env';
};
```

---

### 4.2 `POST /api/mongo-test`

**役割**
MongoDB Atlas への接続テストを行う。
Node.js MongoDB Driver を使用し、`ping` コマンドを実行。

**Runtime**

* Mongo Driver を使うので Edge ではなく Node.js ランタイム指定:

```ts
export const runtime = 'nodejs';
```

**Request**

* メソッド: `POST`
* Body（現状は不要。将来的に「別 URI で試す」などを想定）

```json
{}
```

**Response (成功例)**

```json
{
  "ok": true,
  "elapsedMs": 42,
  "serverInfo": {
    "version": "7.0.0",
    "addr": "cluster0-shard-00-00.xxxx.mongodb.net:27017"
  },
  "timestamp": "2025-12-14T03:21:17.123Z"
}
```

**Response (失敗例)**

```json
{
  "ok": false,
  "elapsedMs": 1200,
  "error": {
    "name": "MongoServerError",
    "code": 18,
    "message": "Authentication failed."
  },
  "timestamp": "2025-12-14T03:21:17.123Z"
}
```

**型定義例**

```ts
// lib/types.ts
export type MongoTestResult =
  | {
      ok: true;
      elapsedMs: number;
      serverInfo: {
        version?: string;
        addr?: string;
      };
      timestamp: string;
    }
  | {
      ok: false;
      elapsedMs: number;
      error: {
        name: string;
        code?: number;
        message: string;
      };
      timestamp: string;
    };
```

---

## 5. 環境変数設計

最低限:

* `MONGODB_URI`: MongoDB Atlas 接続文字列（必須）
* `MONGODB_DB`: 使用する DB 名（任意）
* `ENV_VIEWER_SECRET_KEYWORDS`（任意）

  * 例: `SECRET,KEY,TOKEN,PASS,PWD,URI`
* `ENV_VIEWER_ALLOW_PREFIXES`（任意）

  * 例: `NEXT_PUBLIC_,MONGODB_`

サーバー側は `process.env` を直接参照し、
`lib/env.ts` でフィルタリングとマスクを行ったうえで API が返却。

---

## 6. 実装メモ（Next.js / Node.js MongoDB Driver）

### 6.1 環境変数ユーティリティ `lib/env.ts`

* `getEnvVariables(options)` 的な関数を用意

  * `process.env` を `Object.entries` で列挙
  * allowlist / secret 判定を実施
  * マスク済み値に変換して `EnvVariable[]` を返す

### 6.2 Mongo クライアント `lib/mongoClient.ts`

* 毎回新規接続ではなく、`globalThis` キャッシュを使う形がおすすめ

```ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set');

let clientPromise: Promise<MongoClient>;

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export async function getMongoClient() {
  return clientPromise;
}
```

* `/api/mongo-test` では `getMongoClient()` を呼んで `db.command({ ping: 1 })`

### 6.3 API ハンドラ（App Router）

```ts
// app/api/env/route.ts
import { NextResponse } from 'next/server';
import { getEnvVariables } from '@/lib/env';

export async function GET() {
  const variables = getEnvVariables();
  return NextResponse.json({ variables });
}
```

```ts
// app/api/mongo-test/route.ts
import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongoClient';

export const runtime = 'nodejs';

export async function POST() {
  const startedAt = Date.now();
  try {
    const client = await getMongoClient();
    const dbName = process.env.MONGODB_DB;
    const db = client.db(dbName);
    const pingResult = await db.command({ ping: 1 });
    const elapsedMs = Date.now() - startedAt;

    return NextResponse.json({
      ok: true,
      elapsedMs,
      serverInfo: {
        version: pingResult?.version,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    const elapsedMs = Date.now() - startedAt;
    return NextResponse.json(
      {
        ok: false,
        elapsedMs,
        error: {
          name: e?.name ?? 'Error',
          code: e?.code,
          message: e?.message ?? 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
```

---

## 7. セキュリティ・運用上の注意

* 想定は「ローカル / 自分専用環境」だが、念のため:

  * 本番環境に公開しない（特に `/api/env` は危険）
  * 公開する場合は IP 制限や Basic 認証を必須にする
  * `ENV_VIEWER_ALLOW_PREFIXES` で「見せてもよいキーだけ」を見せる設計も検討
* Mongo 接続テストも DDoS 的な連打を防ぐため、クライアント側で連打抑制（ボタンの disabled）程度は入れておく

---

Cloudinary

結論：**はい、最初から組み込んでスターター化しておくほうが絶対に便利**です。
あなたの用途（個人用 Dev Utility）では、後から追加するより “最初から統合設計” のほうが運用しやすく、構成も汚れません。

特に Cloudinary は Next.js との相性が抜群なので、Starter Kit に含めるメリットが非常に大きいです。

---

# ✅ スターターキットに含めるべき 4 機能

| 機能                                  | 理由                                |
| ----------------------------------- | --------------------------------- |
| **① 環境変数ビューア（マスク付き）**               | 開発者ユーティリティの中心。どのプロジェクトでも即使える。     |
| **② シークレットマネジメント（マスク / Safe Read）** | 誤露出防止。Next.js のローカル・本番の差異確認。      |
| **③ MongoDB Atlas 接続テスト**           | あなたのワークフローでほぼ必須。PoC や個人DB検証向け。    |
| **④ Cloudinary アップロード機能（画像アップロード）** | ローカル書き込み不可な Vercel デプロイ環境では必須／最強。 |

この 4 点は **ユーティリティ・スターターの標準機能** にすると、今後の開発速度が桁違いに上ります。

---

# 🟦 Cloudinary を Starter に入れるメリット

## **1. Vercel との相性が最高（サーバレス前提で設計されている）**

* Edge でも動く
* ファイルシステム不要
* API 認証を簡単にサーバ側に閉じ込められる

## **2. API Route Handler (POST) で簡単にアップロード可能**

Next.js `app/api/upload/route.ts` で署名生成 → クライアントから直接アップロードという構成がベスト。

## **3. Mongo と組み合わせて「画像付きドキュメント管理」などの基盤になる**

* 画像アップロード
* URL + Metadata を Mongo に保存
* Cloudinary Transformation も将来使える

これがスターターに揃っていると、Web ツール系の PoC 全てが高速で組めます。

---

# 🟩 推奨スターター構成（あなたの要件ベースで最適化）

```
app/
 ├─ page.tsx                   # トップ（Utility Dashboard）
 ├─ env/page.tsx               # 環境変数ビューア
 ├─ mongo/page.tsx             # Mongo接続チェック
 ├─ upload/page.tsx            # Cloudinaryアップロードテスト
 └─ api/
      ├─ env/route.ts
      ├─ mongo-test/route.ts
      ├─ cloudinary-sign/route.ts   # 署名サーバ（安全）
      └─ upload (optional, direct upload)
lib/
 ├─ env.ts
 ├─ mongoClient.ts
 ├─ cloudinary.ts              # cloudinary.config & sign
 └─ types.ts
components/
 ├─ EnvTable.tsx
 ├─ MongoStatus.tsx
 ├─ ImageUploader.tsx
 └─ SecretValue.tsx
```

---

# 🟨 Cloudinary の実装（スターターに入れるべき必須ポイント）

### ■ 必要な環境変数

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### ■ 署名生成 API（サーバ側のみ）

```ts
// app/api/cloudinary-sign/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha256")
    .update(`timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
```

### ■ クライアントからのアップロード

```ts
const res = await fetch("/api/cloudinary-sign", { method: "POST" });
const { timestamp, signature, apiKey, cloudName } = await res.json();

const formData = new FormData();
formData.append("file", file);
formData.append("api_key", apiKey);
formData.append("signature", signature);
formData.append("timestamp", timestamp.toString());

await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  body: formData,
});
```

---

# 💡 あなたの “Dev Utility Starter” の価値がさらに上がる理由

* 自作の PoC / ツール開発で毎回必要になる機能を統合
* Vercel 上で完結
* Mongo + Cloudinary の組み合わせで「ほぼ何でも作れる」基盤に
* 今後の作り直しが不要になる

この構成はあなたの案件・技術領域（Next.js・PoC・Mongo・Cloud）と完全に一致しています。

---

# ▶️ 次にやるべきこと

必要ならすぐに：

* **スターターキットのディレクトリ構成テンプレ（実際に Vercel deploy 済みの動作例を含む）**
* **Cloudinary アップロード UI のコンポーネント実装（ドラッグ&ドロップなど）**
* **Mongo と Cloudinary を結合したサンプル API**

もご用意します。

入れてしまって OK → では、スターターのコードスケルトンを一緒に作りますか？

