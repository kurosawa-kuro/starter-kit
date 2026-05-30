# Vercel Next.js Starter

Next.js 16 + React 19 + Tailwind CSS 4 を使用したVercelデプロイ用スターターキット。

## 技術スタック

| 技術 | バージョン |
|------|------------|
| Next.js | 16.0.10 |
| React | 19.2.1 |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |
| ESLint | 9.x |

## ローカル開発

### 前提条件

- Node.js 20.x 以上
- npm または yarn

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## 利用可能なスクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番用ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintによるコードチェック |

## プロジェクト構成

```
src/vercel-nextjs/
├── app/                    # App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── globals.css         # グローバルスタイル
│   └── favicon.ico         # ファビコン
├── public/                 # 静的ファイル
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
├── next.config.ts          # Next.js設定
├── tsconfig.json           # TypeScript設定
├── postcss.config.mjs      # PostCSS設定
├── eslint.config.mjs       # ESLint設定
└── package.json
```

## Vercelへのデプロイ

### 方法1: Vercel CLIを使用

```bash
# Vercel CLIをグローバルインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ（プレビュー）
vercel

# 本番デプロイ
vercel --prod
```

### 方法2: GitHubリポジトリ連携

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. ルートディレクトリを `src/vercel-nextjs` に設定
5. 「Deploy」をクリック

### 環境変数の設定

Vercel Dashboardで環境変数を設定:

1. プロジェクト設定 → Environment Variables
2. 必要な環境変数を追加
3. 再デプロイで反映

## 設定ファイル

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番環境向け設定例
  // images: {
  //   remotePatterns: [
  //     { hostname: 'example.com' }
  //   ]
  // },
  // experimental: {
  //   ppr: true  // Partial Prerendering
  // }
};

export default nextConfig;
```

### vercel.json (オプション)

プロジェクトルートに作成して詳細設定:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 主要機能

- **App Router**: Next.js 13+ のファイルベースルーティング
- **React Server Components**: サーバーサイドレンダリング最適化
- **Tailwind CSS v4**: ユーティリティファーストCSS
- **TypeScript**: 型安全な開発
- **Geist Font**: Vercel公式フォント

## トラブルシューティング

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules .next
npm install
npm run build
```

### TypeScriptエラー

```bash
# 型チェック
npx tsc --noEmit
```

### Vercelデプロイ失敗

1. ビルドログを確認
2. ローカルで `npm run build` を実行して再現確認
3. 環境変数の設定を確認

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [React 19](https://react.dev/)
