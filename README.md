# new_Go_Typescript_blog_project01

# クイックスタートガイド

## 最速セットアップ（5分）

### 1. プロジェクト作成

```bash

# プロジェクトディレクトリを作成

mkdir blogapp && cd blogapp

# 各ディレクトリを作成

mkdir -p backend frontend admin
```

### 2. ファイル配置

生成された各ファイルを対応するディレクトリに配置:

- `docker-compose.yml` → ルート
- 
- `backend/*` → backend/
- 
- `frontend/*` → frontend/
- 
- `admin/*` → admin/

### 3. 環境変数設定

```bash
# バックエンド
cd backend
cat > .env << EOF
DATABASE_URL=host=postgres user=bloguser password=blogpass dbname=blogapp port=5432 sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=8080
EOF

# フロントエンド
cd ../frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

# 管理画面
cd ../admin
cat > .env << EOF
VITE_API_URL=http://localhost:8080
EOF

cd ..
```

### 4. 起動

```bash
# ルートディレクトリで
docker-compose up --build
```

初回は5-10分かかります。以下のメッセージが表示されたら準備完了:

```
backend_1   | Server starting on port 8080
frontend_1  | ready - started server on 0.0.0.0:3000
admin_1     | VITE ready on http://0.0.0.0:3001
```

### 5. 管理者ユーザー作成

新しいターミナルで:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123"
  }'
```

### 6. 管理者権限付与

```bash
docker exec -it blogapp_postgres psql -U bloguser -d blogapp -c \
  "UPDATE users SET is_admin = true WHERE email = 'admin@example.com';"
```

### 7. アクセス

- **フロントエンド**: http://localhost:3000
- **管理画面**: http://localhost:3001 (admin@example.com / admin123)
- **API**: http://localhost:8080

## 記事を投稿してみる

1. http://localhost:3001 にアクセス
2. `admin@example.com` / `admin123` でログイン
3. 左メニュー「記事管理」→「新規作成」
4. 記事を作成して「公開」
5. http://localhost:3000 でフロントエンドを確認

## トラブルシューティング

### ポート競合

```bash
# ポートを変更
# docker-compose.yml の ports セクションを編集
# 例: "3000:3000" → "3002:3000"
```

### データベースエラー

```bash
# コンテナを完全リセット
docker-compose down -v
docker-compose up --build
```

### Hot Reload が効かない

```bash
# サービスを再起動
docker-compose restart backend
docker-compose restart frontend
docker-compose restart admin
```

## 次のステップ

- カテゴリーとタグを作成
- 画像アップロード機能を試す
- コメント機能をテスト
- 検索機能を試す

## 停止方法

```bash
# Ctrl+C で停止後
docker-compose down

# データも削除する場合
docker-compose down -v
```

## ローカル開発（Docker不使用）

### 前提条件
- Go 1.21+
- Node.js 18+
- PostgreSQL 16

### バックエンド

```bash
cd backend
go mod download
go run main.go
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

### 管理画面

```bash
cd admin
npm install
npm run dev
```
