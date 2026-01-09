# Blog Application - Full Stack

Go + TypeScript (Next.js) + PostgreSQL を使用したモダンなブログアプリケーション

## 技術スタック

### バックエンド
- **言語**: Go 1.21+
- **フレームワーク**: Echo
- **ORM**: GORM
- **認証**: JWT
- **データベース**: PostgreSQL 16

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: TanStack Query (React Query)

### 管理画面
- **フレームワーク**: React 18 + Vite
- **言語**: TypeScript
- **ルーティング**: React Router v6

### インフラ
- **コンテナ**: Docker + Docker Compose
- **データベース**: PostgreSQL (Docker)

## プロジェクト構造

```
blogapp/
├── backend/          # Go REST API
├── frontend/         # Next.js フロントエンド
├── admin/            # React 管理画面
└── docker-compose.yml
```

## セットアップ手順

### 1. 前提条件
- Docker & Docker Compose インストール済み
- Git インストール済み

### 2. プロジェクトのクローン

```bash
git clone <your-repository-url>
cd blogapp
```

### 3. 環境変数の設定

#### バックエンド
```bash
cd backend
cp .env.example .env
```

`.env` ファイル:
```
DATABASE_URL=host=postgres user=bloguser password=blogpass dbname=blogapp port=5432 sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=8080
```

#### フロントエンド
```bash
cd ../frontend
cp .env.local.example .env.local
```

`.env.local` ファイル:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### 管理画面
```bash
cd ../admin
cp .env.example .env
```

`.env` ファイル:
```
VITE_API_URL=http://localhost:8080
```

### 4. Docker Compose で起動

プロジェクトルートで:

```bash
docker-compose up --build
```

初回起動時は各イメージのビルドに時間がかかります。

### 5. アクセス

起動が完了したら、以下のURLにアクセス:

- **フロントエンド**: http://localhost:3006
- **管理画面**: http://localhost:3007
- **バックエンドAPI**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### 6. 初期ユーザーの作成

管理画面にログインするには、まずユーザーを作成する必要があります。

#### cURLでユーザー登録

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "password123"
  }'
```

#### または、直接データベースで管理者権限を付与

```bash
# PostgreSQLコンテナに接続
docker exec -it blogapp_postgres psql -U bloguser -d blogapp

# SQLで管理者権限を付与
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
\q
```

### 7. 管理画面にログイン

1. http://localhost:3007 にアクセス
2. 作成したユーザーでログイン
3. 記事の作成・編集が可能に

## 開発コマンド

### 全サービス起動
```bash
docker-compose up
```

### 特定サービスのみ起動
```bash
docker-compose up postgres backend
```

### ログ確認
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### サービス停止
```bash
docker-compose down
```

### データベースリセット（ボリュームも削除）
```bash
docker-compose down -v
docker-compose up --build
```

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー情報（要認証）

### 記事
- `GET /api/posts` - 記事一覧
- `GET /api/posts/:id` - 記事詳細
- `POST /api/posts` - 記事作成（要認証）
- `PUT /api/posts/:id` - 記事更新（要認証）
- `DELETE /api/posts/:id` - 記事削除（要認証）
- `GET /api/posts/search?q=keyword` - 記事検索

### カテゴリー
- `GET /api/categories` - カテゴリー一覧
- `POST /api/categories` - カテゴリー作成（要認証）

### タグ
- `GET /api/tags` - タグ一覧
- `POST /api/tags` - タグ作成（要認証）

### コメント
- `GET /api/comments/post/:postId` - 記事のコメント一覧
- `POST /api/comments` - コメント作成

## トラブルシューティング

### ポートが使用中の場合

`docker-compose.yml` でポート番号を変更:

```yaml
services:
  frontend:
    ports:
      - "3002:3000"  # 3000 → 3002 に変更
```

### データベース接続エラー

1. PostgreSQLが起動しているか確認
```bash
docker-compose ps
```

2. ログを確認
```bash
docker-compose logs postgres
```

### Hot Reload が効かない場合

各サービスを再起動:
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 本番環境デプロイ

### バックエンド
1. `backend/Dockerfile` を本番用に最適化
2. 環境変数を本番用に設定
3. GoバイナリをビルドしてVPS等にデプロイ

### フロントエンド
1. Vercel、Netlify、または任意のホスティングサービスにデプロイ
2. 環境変数 `NEXT_PUBLIC_API_URL` を本番APIのURLに設定

### データベース
1. マネージドPostgreSQL (AWS RDS, Google Cloud SQL等) を使用
2. バックアップを定期的に実行

## ライセンス

MIT

## 作成者

Your Name
