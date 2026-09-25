# DELIVERY LIFE — Cloudflare Pages + D1

プロトタイプ（`delivery_life_prototype_v2.html`）を Cloudflare Pages Functions + D1 で動かす構成です。

## 構成

```
delibery_life/
├── public/index.html          # フロント（静的）
├── functions/api/             # Pages Functions（D1 API）
├── migrations/0001_init.sql   # D1 スキーマ
├── wrangler.toml
└── package.json
```

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/state` | タスク一覧 + 目標取得 |
| POST | `/api/tasks` | 配達追加 |
| PUT | `/api/settings` | 目標更新 |
| POST | `/api/demo` | デモデータ投入 |
| DELETE | `/api/reset` | 全削除 |

## セットアップ

```bash
cd delibery_life
npm install
npx wrangler login
```

### 1. D1 データベース作成

```bash
npm run db:create
```

表示される `database_id` を `wrangler.toml` の `REPLACE_WITH_YOUR_D1_DATABASE_ID` に書き換える。

### 2. マイグレーション

```bash
# ローカル
npm run db:migrate:local

# 本番（リモート）
npm run db:migrate:remote
```

### 3. ローカル起動

```bash
npm run dev
```

ブラウザで表示された URL（例: `http://127.0.0.1:8788`）を開く。

### 4. デプロイ

```bash
npm run deploy
```

初回は Cloudflare ダッシュボードで Pages プロジェクト `delivery-life` が作成されます。  
ダッシュボード側で D1 バインディング（変数名 `DB`）が付いていることを確認してください（`wrangler.toml` から自動反映されます）。

## 注意

- 認証なしの個人利用向けです。公開すると誰でもデータ操作できます。
- 本番とローカルの D1 は別です。ローカルは `.wrangler/state` に保存されます。
