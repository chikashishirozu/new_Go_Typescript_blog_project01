# Blog App Backend

Go言語とGinフレームワークを使用したブログアプリケーションのバックエンドAPI

## 必要要件

- Go 1.21以上
- PostgreSQL 15以上
- Docker & Docker Compose (オプション)

## セットアップ

### 1. 依存関係のインストール
```bash
go mod download
```

### 2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して適切な値を設定
```

### 3. データベースのマイグレーション
```bash
make migrate-up
```
# サーバー起動
```bash
make run
```
# マイグレーション実行
```bash
make migrate-up
```
# マイグレーションロールバック
```bash
make migrate-down
```
# 新しいマイグレーション作成
```bash
make migrate-create
make migrate-create name=add_new_column
プロジェクトの続き: マイグレーションOKなら、シードデータ投入（make migrate-seed？）やアプリ起動（make run）を試してください。
go run cmd/migrate/main.go seed
```
# ビルド
```bash
make build
```
# テスト実行
```bash
make test
```
# クリーンアップ
```bash
make clean
```
### 4. サーバーの起動
```bash
make run
```

## Docker での起動
```bash
# ビルドと起動
make docker-up

# 停止
make docker-down
```

## APIエンドポイント

### 認証

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### 投稿

- `GET /api/posts` - 投稿一覧取得
- `GET /api/posts/:id` - 投稿詳細取得
- `GET /api/posts/slug/:slug` - スラッグで投稿取得
- `POST /api/posts` - 投稿作成 (認証必要)
- `PUT /api/posts/:id` - 投稿更新 (認証必要)
- `DELETE /api/posts/:id` - 投稿削除 (認証必要)

### カテゴリー

- `GET /api/categories` - カテゴリー一覧取得
- `POST /api/categories` - カテゴリー作成 (認証必要)
- `PUT /api/categories/:id` - カテゴリー更新 (認証必要)
- `DELETE /api/categories/:id` - カテゴリー削除 (認証必要)

### タグ

- `GET /api/tags` - タグ一覧取得
- `POST /api/tags` - タグ作成 (認証必要)
- `PUT /api/tags/:id` - タグ更新 (認証必要)
- `DELETE /api/tags/:id` - タグ削除 (認証必要)

### コメント

- `GET /api/posts/:id/comments` - コメント一覧取得
- `POST /api/posts/:id/comments` - コメント作成 (認証必要)
- `PUT /api/comments/:id` - コメント更新 (認証必要)
- `DELETE /api/comments/:id` - コメント削除 (認証必要)

### ファイルアップロード

- `POST /api/upload` - ファイルアップロード (認証必要)

## 開発コマンド
```bash
# サーバー起動
make run

# マイグレーション実行
make migrate-up

# マイグレーションロールバック
make migrate-down

# 新しいマイグレーション作成
make migrate-create

# ビルド
make build

# テスト実行
make test

# クリーンアップ
make clean
```

## ライセンス

MIT
