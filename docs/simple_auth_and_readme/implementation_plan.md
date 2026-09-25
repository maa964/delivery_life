# 実装計画: 簡易認証の追加とREADME更新

## 概要
Cloudflare Pages Functions に Basic 認証ミドルウェアを追加し、個人利用向けにアプリ全体（静的ファイルおよびAPI）を保護します。また、GitHub 連携が完了した運用フローに合わせて `README.md` を更新します。

---

## 1. 簡易認証の実装方針
### 対象ファイル: `functions/_middleware.js`
- Cloudflare Pages Functions のミドルウェア機能を利用し、全てのリクエストに対して HTTP Basic 認証チェックを行います。
- **動作仕様**:
  - 環境変数 `AUTH_USER` および `AUTH_PASS` が設定されている場合:
    - リクエストヘッダー `Authorization` から認証情報を取得・デコード。
    - 一致しない、またはヘッダーが存在しない場合は `401 Unauthorized` （`WWW-Authenticate: Basic realm="DELIVERY LIFE"`）を返却。
  - 環境変数 `AUTH_USER` / `AUTH_PASS` が設定されていない場合:
    - ローカル開発時や初期設定時等に扱いやすいよう、認証チェックをスキップして次の処理を実行。

---

## 2. README.md の更新方針
### 対象ファイル: `README.md`
- GitHub 連携が完了した現在の運用フローに合わせて構成を見直し。
  - Git push による自動デプロイの流れ。
  - Cloudflare Pages 上での環境変数設定（`AUTH_USER`, `AUTH_PASS`）による簡易認証の有効化手順。
  - D1 バインディングとマイグレーションの最新手順の整理。

---

## 3. 検証計画
- `functions/_middleware.js` のロジック検証。
- `wrangler pages dev` でのローカル動作確認。
