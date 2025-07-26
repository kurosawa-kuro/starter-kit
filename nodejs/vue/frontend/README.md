# Vue Frontend

Vue 3 + Vite + Tailwind CSS + MSW + Testing Library を使用したフロントエンドアプリケーション

## セットアップ

```bash
npm install
```

## 開発サーバー

```bash
# 通常の開発サーバー
npm run dev

# MSW有効で開発サーバー（バックエンドなしで開発可能）
npm run dev:mock
```

## テスト

```bash
# テスト実行
npm run test

# テストUI
npm run test:ui

# カバレッジ付きテスト
npm run test:coverage
```

## MSW (Mock Service Worker)

このプロジェクトでは MSW を使用してAPIモックを実装しています。

### 設定ファイル

- `src/mocks/handlers.js` - APIハンドラーの定義
- `src/mocks/server.js` - テスト用MSWサーバー
- `src/mocks/browser.js` - ブラウザ用MSWワーカー

### 使用方法

#### 開発環境

環境変数 `VITE_ENABLE_MSW=true` を設定することで、開発環境でMSWが有効になります：

```bash
npm run dev:mock
```

#### テスト環境

テストでは自動的にMSWが有効になり、APIコールがモックされます。

### カスタムハンドラーの追加

`src/mocks/handlers.js` に新しいハンドラーを追加：

```javascript
http.get('/api/custom-endpoint', () => {
  return HttpResponse.json({
    status: 'success',
    data: { message: 'Custom response' }
  })
})
```

## Testing Library

Vue Testing Library を使用してコンポーネントテストを実装しています。

### テストファイル構成

- `src/components/**/__tests__/` - コンポーネントテスト
- `src/stores/__tests__/` - ストアテスト
- `src/tests/integration/` - 統合テスト

### テストの書き方

```javascript
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

describe('MyComponent', () => {
  it('renders correctly', async () => {
    render(MyComponent)
    
    await waitFor(() => {
      expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })
  })
})
```

## プロジェクト構造

```
src/
├── components/          # Vueコンポーネント
│   ├── HelloWorld/     # HelloWorld関連コンポーネント
│   └── common/         # 共通コンポーネント
├── stores/             # Piniaストア
├── services/           # APIサービス
├── mocks/              # MSW設定
│   ├── handlers.js     # APIハンドラー
│   ├── server.js       # テスト用サーバー
│   └── browser.js      # ブラウザ用ワーカー
├── tests/              # テストファイル
│   ├── setup.js        # テストセットアップ
│   └── integration/    # 統合テスト
└── utils/              # ユーティリティ
```
