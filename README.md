# DELIVERY LIFE — Cloudflare Pages + D1

日常のタスク完了を「配達」として記録し、報酬ポイントを積み上げるパーソナルダッシュボードアプリです。  
Cloudflare Pages（静的フロントエンド + Pages Functions）と Cloudflare D1（サーバーレス SQLite）で稼働します。

## 構成

```
.
├── public/
│   └── index.html             # フロントエンド（HTML/CSS/JS）
├── functions/
│   ├── _middleware.js         # 簡易Basic認証ミドルウェア
│   ├── _shared/
│   │   └── db.js              # D1ヘルパー関数
│   └── api/
│       ├── state.js           # GET  /api/state（タスク・目標取得）
│       ├── tasks.js           # POST /api/tasks（配達追加）
│       ├── settings.js        # PUT  /api/settings（目標更新）
│       ├── demo.js            # POST /api/demo（デモデータ投入）
│       └── reset.js           # DELETE /api/reset（全データ削除）
├── migrations/
│   └── 0001_init.sql          # D1 初期スキーマ
├── wrangler.toml              # Wrangler / D1 設定ファイル
└── package.json
```

## API 仕様

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/state` | タスク一覧 + 目標取得 |
| POST | `/api/tasks` | 配達追加 |
| PUT | `/api/settings` | 目標更新 |
| POST | `/api/demo` | デモデータ投入 |
| DELETE | `/api/reset` | 全削除 |

---

## 🔒 簡易認証（Basic認証）の設定

アプリ全体（Web画面およびAPI）にパスワード保護をかけることができます。

### 本番環境（Cloudflare Pages）での設定
1. Cloudflare ダッシュボードを開き、**Workers & Pages** → **delivery-life** を選択
2. **Settings** → **Environment variables** を開く
3. 「**Add variables**」をクリックし、以下を設定して保存します：
   - `AUTH_USER`: 任意のログインユーザー名
   - `AUTH_PASS`: 任意のパスワード（または `AUTH_PASSWORD`）
4. 保存後、新しいデプロイを実行（または `main` に push）すると Basic 認証が有効になります。

> **Note**: `AUTH_USER` および `AUTH_PASS` が未設定の場合は、認証なし（アクセス制限なし）で動作します。

### ローカル開発環境での認証テスト
プロジェクト直下に `.dev.vars` を作成すると、ローカル起動（`npm run dev`）時にも環境変数を読み込めます。

```ini
AUTH_USER=admin
AUTH_PASS=mypassword
```

---

## 🚀 デプロイと運用（GitHub 連携）

GitHub リポジトリ連携が設定済みのため、`main` ブランチへ push すると自動的にビルド＆デプロイが行われます。

```bash
git add .
git commit -m "feat: add basic auth"
git push origin main
```

### Cloudflare Pages のビルド設定（確認用）
- **Framework preset**: `None`
- **Build command**: `exit 0`
- **Build output directory**: `public`
- **Root directory**: （空欄）

### D1 データベースのバインディング（確認用）
- **Settings → Functions → D1 database bindings** に以下が設定されていることを確認してください。
  - Variable name: `DB`
  - D1 database: `delivery-life`

---

## 💻 ローカル開発・セットアップ

```bash
# 依存関係インストール
npm install

# ローカル用 D1 マイグレーション
npm run db:migrate:local

# 開発サーバー起動（http://127.0.0.1:8788）
npm run dev
```

### 本番 D1 データベースへのマイグレーション実行
初回作成時やスキーマ更新時は、リモート（本番）にもマイグレーションを適用します。

```bash
npm run db:migrate:remote
```

