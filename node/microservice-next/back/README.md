以下では **`back/service-a`** を “API 専⽤ Next.js（App Router）マイクロサービス” として育てるために、
**テストランナー・Swagger (OpenAPI)・環境変数管理** を最初から雛形化する手順とサンプルをまとめました。

---

## 1 📦 依存パッケージを追加

```bash
# API スキーマ & Swagger
pnpm add zod zod-to-openapi swagger-ui-express

# ルートハンドラのユニット / E2E テスト
pnpm add -D vitest supertest @vitest/coverage-v8

# .env ローダ
pnpm add dotenv-flow          # .env, .env.local, .env.prod …を階層読み込み
```

---

## 2 🗂️ プロジェクト構成（追加分だけ抜粋）

```
back/service-a
├─ src/            # (--src-dir で生成済み)
│  ├─ app/
│  │  └─ api/
│  │     ├─ health/
│  │     │  └─ route.ts          # /api/health
│  │     └─ users/
│  │        ├─ route.ts          # CRUD サンプル
│  │        └─ schema.ts         # Zod スキーマ
│  ├─ lib/
│  │  ├─ env.ts                  # 環境変数ローダ（dotenv-flow）
│  │  ├─ logger.ts               # Pino ラッパ
│  │  └─ openapi.ts              # OpenAPI 生成
│  └─ tests/
│     └─ users.test.ts           # Vitest + Supertest
├─ .env.example
├─ vitest.config.ts
└─ next.config.mjs
```

---

## 3 🔑 環境変数ローダ (`src/lib/env.ts`)

```ts
import { config } from "dotenv-flow";
import { z } from "zod";

config(); // .env.* を読み込み

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.string().default("3000"),
  DB_URL: z.string().url().optional(),  // memory/jsondb のときは空でも OK
});

export const env = EnvSchema.parse(process.env);
```

`.env.example` — 共有用テンプレ

```dotenv
NODE_ENV=development
PORT=3000
DB_URL=postgres://postgres:password@localhost:5432/service_a
```

---

## 4 📝 Zod でスキーマ → OpenAPI へ

### `src/app/api/users/schema.ts`

```ts
import { z } from "zod";
import { extendZodWithOpenApi } from "zod-to-openapi";
extendZodWithOpenApi(z);

export const User = z
  .object({
    id: z.string().openapi({ example: "u_123" }),
    name: z.string().openapi({ example: "Alice" }),
  })
  .openapi("User");

export const CreateUserBody = z
  .object({ name: z.string() })
  .openapi("CreateUserBody");
```

### `src/lib/openapi.ts`

```ts
import { OpenAPIRegistry, generateOpenApiDocument } from "zod-to-openapi";
import { User, CreateUserBody } from "@/app/api/users/schema";

const registry = new OpenAPIRegistry();

registry.register("User", User);
registry.register("CreateUserBody", CreateUserBody);

// ルートハンドラ側で registry.registerPath(...) を足していく
export const spec = generateOpenApiDocument(registry, {
  openapi: "3.1.0",
  info: { title: "Service-A API", version: "0.1.0" },
  servers: [{ url: "/api" }],
});
```

### Swagger エンドポイント

`src/app/api/docs/route.ts`

```ts
import { NextRequest } from "next/server";
import swagger from "swagger-ui-express";
import { spec } from "@/lib/openapi";

export const GET = async () => new Response(JSON.stringify(spec, null, 2), {
  headers: { "content-type": "application/json" },
});

// /api/docs (人が見る) は Edge ではなく Node ランタイムでホスト
export const runtime = "nodejs";

export const middleware = swagger.serve;
export const handler = swagger.setup(spec);
```

*ブラウザで `/api/docs` → Swagger UI、`/api/openapi.json` → 生 JSON*

---

## 5 🔧 サンプル Route Handler

`src/app/api/users/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { registry } from "@/lib/openapi";
import { User, CreateUserBody } from "./schema";

let inMemory: { id: string; name: string }[] = []; // 今はメモリ実装

registry.registerPath({
  method: "get",
  path: "/users",
  responses: {
    200: { description: "ユーザー一覧", content: { "application/json": { schema: User.array() } } },
  },
});

export const GET = async () => NextResponse.json(inMemory);

registry.registerPath({
  method: "post",
  path: "/users",
  request: { body: { content: { "application/json": { schema: CreateUserBody } } } },
  responses: { 201: { description: "Created", content: { "application/json": { schema: User } } } },
});

export const POST = async (req: NextRequest) => {
  const body = CreateUserBody.parse(await req.json());
  const newUser = { id: `u_${Date.now()}`, name: body.name };
  inMemory.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
};
```

---

## 6 🧪 Vitest + Supertest

`vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: { reporter: ["text", "html"] },
  },
});
```

`src/tests/users.test.ts`

```ts
import request from "supertest";
import { handler as app } from "@/app/api/users/route"; // NextRouteHandler → Express 互換ラッパを別途用意

describe("Users API", () => {
  it("POST /users → 201", async () => {
    const res = await request(app).post("/users").send({ name: "Bob" });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Bob");
  });
});
```

`package.json` スクリプト

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "next lint"
  }
}
```

---

## 7 🚀 次のステップ

| 優先  | やること                                                 | ポイント                              |
| --- | ---------------------------------------------------- | --------------------------------- |
| ★★★ | **jsondb / sqlite / postgres** 実装の Repository 層を切り替え | `DATA_BACKEND` 環境変数で分岐            |
| ★★☆ | Pino + pino-http で JSON ログ基盤                         | Loki 送信は side-car or Promtail     |
| ★★☆ | `/healthz /readyz` route 追加                          | k8s liveness / readiness probe 対応 |
| ★☆☆ | GitHub Actions で **lint→test→build→push**            | Cache: pnpm, next build           |

これで **service-a** は「PoC→本番」両対応の API 雛形になります。必要に応じて **service-b** も同じテンプレで複製し、マイクロサービス間通信（gRPC/REST/イベント）を追加していくとスケールしやすいですよ。


## RabbitMQ 対応をスターターに追加する手順

> **ゴール**
> 1️⃣ **発行（Publish）** ― 例：ユーザー登録時に `user.created` イベントを送信
> 2️⃣ **購読（Consume）** ― 別 Worker でメッセージを処理
> 3️⃣ **ヘルスチェック** に RabbitMQ 接続状態を組み込み
> 4️⃣ **ローカル開発** は `docker-compose` で即起動

---

### 1. パッケージ & 依存

```bash
# 再接続と ch 確認付きの便利ラッパー
pnpm add amqp-connection-manager amqplib
```

---

### 2. `.env` とスキーマ追加

```dotenv
# .env.example
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_EXCHANGE=service_a.topic
```

`src/lib/env.ts` の Zod スキーマに追記:

```ts
const EnvSchema = z.object({
  /* ...既存... */
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_EXCHANGE: z.string().default("service_a.topic"),
});
```

---

### 3. 接続ユーティリティ `src/lib/rabbitmq.ts`

```ts
import { createChannel, ChannelWrapper } from "amqp-connection-manager";
import { env } from "@/lib/env";
import pino from "@/lib/logger";

let channel: ChannelWrapper | null = null;

export const getRabbitChannel = async (): Promise<ChannelWrapper> => {
  if (channel) return channel;

  const connection = createChannel({
    connectionString: env.RABBITMQ_URL,
    json: true,
  });

  connection.on("connect", () => pino.info("RabbitMQ connected"));
  connection.on("disconnect", ({ err }) =>
    pino.error({ err }, "RabbitMQ disconnected"),
  );

  channel = connection;
  await channel.addSetup((ch) =>
    ch.assertExchange(env.RABBITMQ_EXCHANGE, "topic", { durable: true }),
  );

  return channel;
};
```

---

### 4. **Publish** ― ユーザー作成ルートの改修

`src/app/api/users/route.ts` の `POST` 内で:

```ts
import { getRabbitChannel } from "@/lib/rabbitmq";

/* ...POST ハンドラ内部... */
const ch = await getRabbitChannel();
await ch.publish(
  env.RABBITMQ_EXCHANGE,
  "user.created",
  Buffer.from(JSON.stringify(newUser)),
  { persistent: true },
);
```

---

### 5. **Consume** ― Worker プロセス

`src/worker/userCreatedConsumer.ts`

```ts
import { getRabbitChannel } from "@/lib/rabbitmq";
import { env } from "@/lib/env";
import pino from "@/lib/logger";

(async () => {
  const ch = await getRabbitChannel();
  const { queue } = await ch.assertQueue("user_created_q", { durable: true });
  await ch.bindQueue(queue, env.RABBITMQ_EXCHANGE, "user.created");

  ch.consume(
    queue,
    (msg) => {
      if (!msg) return;
      const payload = JSON.parse(msg.content.toString());
      pino.info(payload, "received user.created");
      // ここで DB 書き込みやメール送信など…
      ch.ack(msg);
    },
    { noAck: false },
  );
})();
```

起動スクリプト（`package.json`）:

```jsonc
{
  "scripts": {
    "worker": "ts-node --transpile-only src/worker/userCreatedConsumer.ts"
  }
}
```

---

### 6. ヘルスチェック強化

`/api/health` を修正し、RabbitMQ との接続可否を確認:

```ts
import { getRabbitChannel } from "@/lib/rabbitmq";

export const GET = async () => {
  try {
    const ch = await getRabbitChannel();
    await ch.checkExchange(env.RABBITMQ_EXCHANGE);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
};
```

---

### 7. `docker-compose.yml` 追加 (開発用)

```yaml
version: "3.8"
services:
  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"
      - "15672:15672"  # 管理 UI
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
```

```bash
# ルートで
docker compose up -d rabbitmq
```

---

### 8. テストのヒント

* **ユニットテスト**：`amqplib` を `vitest.mock()` でスタブ
* **E2E**：`testcontainers-node` で RabbitMQ を立ち上げ → メッセージ往復を検証

---

### 9. デプロイ先での運用メモ

| 項目             | 推奨                                                           |
| -------------- | ------------------------------------------------------------ |
| **Kubernetes** | StatefulSet（耐障害性が欲しい場合は RabbitMQ Cluster Operator も検討）       |
| **Helm**       | `bitnami/rabbitmq` チャート → `values.yaml` でメモリ量とポリシーを調整        |
| **モニタリング**     | `prometheus-rabbitmq-exporter` → Grafana ダッシュボード             |
| **DLQ**        | `user.created.dlq` キューをあらかじめ用意し、`x-dead-letter-exchange` で転送 |

---

### 10. 今後のロードマップ

1. **service-b とのイベント駆動連携**

   * 例：`order.placed` → service-a でユーザー残高を更新
2. **トレーシング (OpenTelemetry)**

   * RabbitMQ Publish/Consume を span で可視化
3. **Idempotent Consumer** 実装

   * メッセージ重複処理の保険（PostgreSQL に処理 ID 保存等）

---

これで **RabbitMQ 対応** を組み込んだ **service-a** の土台が完成します。
`docker compose up` → `pnpm dev & pnpm worker` で即イベントが流れることを確認してみてください。

### 結論 ― “Auth” と “User” を別マイクロサービスに分けるのは **かなり一般的**

特に **①組織やプロダクトが複数のサービス／クライアントから共通ログインしたい**、**②セキュリティ要件が厳しく専任チームで運用したい** というケースでは、**Auth（認証＋トークン発行）を専用サービス**にして、**User（プロフィールや属性の CRUD）を独立した業務ドメイン**として持つ構成が主流です。([microservices.io][1], [phaneendrakn.medium.com][2])

---

## なぜ分けるのか ― 3 つの典型シナリオ

| シナリオ                              | ポイント                                                                  | 代表的な構成                                                           |
| --------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **1. API Gateway/BFF が Auth を委譲** | *UI → Gateway* でトークンを発行／検証。下位サービスは JWT のクレームだけ見るので “ユーザーを知らない” 作りにできる | Keycloak / Cognito など外部 IdP → Gateway → マイクロサービス郡                |
| **2. 自前 Auth サービス**               | 内製でトークン発行・パスワード管理・MFA 対応。高速パスワードハッシュやレート制限を 1 箇所で実装                   | `auth-svc`（token, refresh, social login） + `user-svc`（プロフィール／設定） |
| **3. AuthZ まで別立て**                | Oso / Permit などポリシーサーバを立て、「認可ルール」も中央集約                                | `auth-svc` (AuthN) + `authz-svc` (ReBAC/RBAC) + `user-svc`       |

---

## メリットと注意点

| ✔️ メリット                                          | ⚠️ 注意点                                                          |
| ------------------------------------------------ | --------------------------------------------------------------- |
| **セキュリティ境界が明快** → 脆弱性調査・監査が楽になる                  | **ネットワーク往復と依存**が増える（API Gateway / mTLS / レートリミットが必須）            |
| **SSO や外部 IdP 連携が簡単**                            | **ローカル開発が面倒** → docker-compose で IdP コンテナを立てる、モックトークン発行スクリプトを用意 |
| **スケール戦略を分けられる**（Auth は CPU/IO 集約、User はストレージ集約） | **プロフィール更新イベント**を各サービスに配信する仕組み（Kafka / RabbitMQ など）がほぼ必要        |
| **GDPR/PIPL など個人情報削除の責務が限定的**                    | **トランザクションを跨ぐ整合性**は最終的整合性や Saga で吸収する                           |

---

## 「まとめて一つ」でもいいケースは？

| こんな状況なら…               | まずは **単一 `user-svc` に Auth ロジックを同居**   |
| ---------------------- | -------------------------------------- |
| **PoC／早期フェーズでチームが小さい** | 分割コストの方が高い。将来切り出ししやすいよう層（=パッケージ）だけ分ける  |
| **社内向けツールで SSO 不要**    | 社内 LDAP / SAML を直接たたく方が早い              |
| **Auth0 等を SaaS で採用**  | 外部 IdP が全部やってくれるので、バックエンド側は “トークン検証だけ” |

---

## 切り出し時の実装メモ（service-a / service-b の例）

1. **`auth-svc`**

   * `/login`, `/refresh`, `/mfa/verify` - styled REST
   * JWT (短命) + refresh token (長命, http-only cookie)
   * 発行時に **`userId`, `roles`, `permissions`** をクレームに含める

2. **`user-svc`**

   * `/users/{id}` CRUD, `/users/{id}/settings`, `/users/{id}/avatar`
   * 変更があれば **`user.updated`** イベントを RabbitMQ へ publish
   * 認可が細かい場合は `authz-svc` に `isAllowed(userId, resource, action)` を gRPC で問い合わせ

3. **API Gateway**

   * 全リクエストで JWT 検証 → header に `X-User-Id`, `X-Roles` を付与
   * 失効判定は Redis キャッシュ・トークンブラックリストで高速化

---

### TL;DR

* **分けるのが「普通」**：組織横断の SSO、ゼロトラスト、スケール分離、監査対応の4拍子が揃った今は“Auth-as-a-Service”がデファクト。
* **ただし“目的と規模”で判断**：PoC や小規模なら 1 サービスにまとめ、後でドメイン層を抜き出せる設計にしておけば十分。
* **やるなら最初にイベント駆動 & トークン設計を決めておく**と、後のマイグレーションコストが激減します。

「実際に service-a / service-b で分ける具体的な Docker Compose や Next.js / Nest.js の雛形が欲しい」といった詳細があれば、また教えてください！

[1]: https://microservices.io/post/architecture/2025/05/28/microservices-authn-authz-part-2-authentication.html "Authentication and authorization in a microservice architecture: Part 2 - Authentication"
[2]: https://phaneendrakn.medium.com/microservices-design-patterns-series-part-4-5-bc8bce476226 "Microservices Design Patterns Series — Part 4/5 | by Phaneendra Kumar Namala | Medium"


“Zod だけ書けば Swagger が出てくる”――ほぼ Yes
――ただし「Zod ➜ OpenAPI を橋渡しするライブラリ」を 1 つ噛ませる必要があります。代表格は zod-to-openapi や zod-openapi などで、どちらも Zod スキーマに .openapi() メタデータを付けるだけで OpenAPI 3.1 JSON を生成できます。

“A library that uses Zod schemas to generate an Open API Swagger documentation” 
github.com

“zod-openapi… use Zod schemas to generate OpenAPI v3.x documentation” 
npmjs.com

最小ステップ（zod-to-openapi 例）
インストール

bash
コピーする
編集する
pnpm add zod @asteasolutions/zod-to-openapi swagger-ui-express
Zod を拡張してスキーマ定義

ts
コピーする
編集する
// src/schemas/user.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);              // ←★ これで .openapi() が生える

export const User = z.object({
  id:   z.string().openapi({ example: 'u_001' }),
  name: z.string().openapi({ example: 'Alice' })
}).openapi('User');
経路（パス）を Registry に登録して JSON 生成

ts
コピーする
編集する
// src/lib/openapi.ts
import { OpenAPIRegistry, generateOpenApiDocument } from '@asteasolutions/zod-to-openapi';
import { User } from '@/schemas/user';

const registry = new OpenAPIRegistry();

// ルートを宣言 （Next.js の route ハンドラと 1 行ずれで書ける）
registry.registerPath({
  method: 'get',
  path: '/users',
  responses: {
    200: { description: 'List', content: { 'application/json': { schema: User.array() } } }
  }
});

export const spec = generateOpenApiDocument(registry, {
  openapi: '3.1.0',
  info: { title: 'Service-A API', version: '0.1.0' }
});
Swagger UI に渡すだけ

ts
コピーする
編集する
// src/app/api/docs/route.ts (Next.js App Router)
import swagger from 'swagger-ui-express';
import { spec } from '@/lib/openapi';

export const runtime = 'nodejs';
export const middleware = swagger.serve;
export const handler    = swagger.setup(spec);
ブラウザで /api/docs を開けば、新しく書いた Zod スキーマ／パスが即反映されます。
Next.js を next dev で動かしている場合は ホットリロードで自動更新されるので “勝手に出来上がる” 体験になります。

どこまで “自動” か？
項目	必要作業	説明
スキーマ	.openapi() を付けるだけ	型・バリデーション・例示を 1 箇所で定義
エンドポイント	registry.registerPath() などで 1 行宣言	ルートを全自動検出する仕組みはまだ少数（Hono の @hono/zod-openapi など一部フレームワークは自動）
Swagger 反映	generateOpenApiDocument() を呼ぶ	ビルド時（CI）にファイル出力することも、ランタイムで毎回生成することも可能

つまり: “Zod 定義を書くだけ → Swagger UI 更新” は ほぼワンステップ。
エンドポイントの登録だけは 1 行 追加するイメージです。

ほかの選択肢と注意点
ライブラリ	特徴	向いているケース
@asteasolutions/zod-to-openapi	Registry パターンで柔軟。Webhook も書ける	Next.js / Express / Nest など汎用系
zod-openapi	createDocument() の一括生成が簡単	小規模 API、ファイル生成派
@hono/zod-openapi	ルート宣言を自動取得。Hono 専用	Hono フレームワーク利用時
tsoa / NestJS Swagger	Decorator ベース (class, dto)	OOP / Nest 流儀のプロジェクト

制限: Zod の transform() など一部タイプは OpenAPI に 1:1 変換できない（Unsupported list あり）。

速度: 小規模ならランタイム生成で十分。大規模は CI で JSON/YAML を書き出して Nginx/Redocly に配信 が定番。

TL;DR
Zod + zod-to-openapi などを挟めば、スキーマを書く＝Swagger が更新の “単一ソース” が実現。

ルート定義は 1 行 registerPath() するだけ（自動検出系フレームワークも増加中）。

本番では生成物をファイル出力して Redocly / Swagger UI にホストするのが王道。

これで「コードを書くだけでドキュメントが同期される」ワークフローが手に入ります。もし CI への組み込み例 や パス自動検出の新しいプラグイン など、さらに深掘りしたい部分があれば気軽にどうぞ！