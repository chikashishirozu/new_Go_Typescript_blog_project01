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


# 使用コマンド週

```
$ git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
$ echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
$ echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc
$ source ~/.bashrc
$ asdf plugin add golang
$ asdf list golang
$ asdf install golang 1.22.1
$ asdf global golang 1.22.1
$ which go
$ which -a go
$ go env GOROOT
$ sudo dnf repoquery --whatrequires golang
$ sudo dnf remove golang
$ go env GOROOT
$ which go
$ go version
$ docker compose up --build
$ docker ps
$ sudo touch /etc/containers/nodocker
$ openssl rand -base64 32
$ go test -run TestRand -v
$ mkdir -p database models utils
$ tree -R
$ docker compose up --build
$ go run cmd/migrate/main.go -action up
$ docker compose down -v
$ docker exec -it blogapp_postgres psql -U bloguser -d blogapp
$ go get gorm.io/driver/postgres
$ sudo chown $USER:$USER .air.toml
$ chmod 644 .air.toml
$ sudo chown -R $USER:$USER frontend admin
$ sudo chown -R hiroppy123:hiroppy123 .
$ chmod -R u+rwX .
$ docker builder prune -f
$ docker image prune -f
$ docker volume prune -f\
$ docker network prune -f
$ sudo chown -R $USER:$USER frontend/ admin/
$ sudo chown -R $USER:$USER .
$ docker compose build --no-cache
$ docker compose up -d
$ docker compose up
$ docker compose logs -f
$ rm -rf frontend/node_modules frontend/.next
$ rm -rf admin/node_modules
```



```
go.mod　と　go.sum　（backend/　に必要）　の生成コマンドを雑学や業界はなしを交えながら解説してください。

了解です。
Goを触り始めた人が必ず一度は混乱する
👉 go.mod と go.sum は何者か？どうやって生成されるのか？
を、雑学＋業界の空気感込みで解説します。

- まず結論（忙しい人向け）
go mod init example.com/myapp
go mod tidy


go.mod → 依存関係の設計図（宣言）

go.sum → 依存関係の検品記録（証拠）

現場感覚で言うと
go.mod = 発注書
go.sum = 納品チェックリスト

① go.mod とは何か？
生成コマンド
go mod init github.com/username/project

これで起きること

go.mod が作られる

モジュール名が確定

Go Modules モードに突入（Go 1.11以降の標準）

module github.com/username/project

go 1.22

実務での意味

このプロジェクトの世界観を定義するファイル

import パスの起点

依存関係のバージョン固定

require (
    github.com/gin-gonic/gin v1.9.1
)

業界話 🗣

昔（GOPATH時代）は 依存関係が地獄

CIでビルドできないのは日常茶飯事

go.mod登場で「ビルドが再現可能」になった

Goが企業採用された最大理由の一つがこれ

② go.sum とは何か？
生成タイミング

以下のどれかで自動生成されます：

go mod tidy
go build
go test
go get

正体
github.com/gin-gonic/gin v1.9.1 h1:xxxxxxxx
github.com/gin-gonic/gin v1.9.1/go.mod h1:yyyyyyyy

何を書いている？

ダウンロードしたモジュールの

ハッシュ（改ざん防止用）

雑学 🧠

go.sum は セキュリティ機能

依存ライブラリがこっそり書き換えられていたら即検知

Supply Chain Attack 対策

npm/yarnが後追いで真似したレベル

③ go mod tidy：最重要コマンド
go mod tidy

やっていること

使ってない依存 → 削除

足りない依存 → 追加

go.mod と go.sum を整える

実務では

CI前に必ず叩く

PRレビューで「tidyして」が飛ぶ

業界あるある

❌ go.sum 消して怒られる

❌ go mod tidy してなくてCI落ちる

✅ tidyは礼儀

④ よくある誤解（初心者あるある）
❌ go.sum は gitignore していい？

👉 絶対ダメ

CIや他人の環境でビルド不能

セキュリティ的にもアウト

❌ go.sum は手で編集？

👉 触らない

Goツールが管理

人間は信用されていない

⑤ 実務フロー（現場のリアル）
git clone ...
go mod tidy
go test ./...
go build


これで 誰の環境でも同じ結果

Docker不要でも再現可能

⑥ 他言語との比較（業界視点）
言語	設計図	ロック
Go	go.mod	go.sum
Node	package.json	package-lock.json
Python	pyproject.toml	poetry.lock
Rust	Cargo.toml	Cargo.lock
業界評価

Goは「仕組みがシンプルで壊れにくい」

運用重視の企業（インフラ・SRE）に刺さる

⑦ 削除していい？ダメ？
ファイル	削除可	理由
go.mod	❌	プロジェクト崩壊
go.sum	⚠️	再生成可だが非推奨
vendor/	⭕	状況次第
まとめ（現場視点）

go mod init → プロジェクト宣言

go mod tidy → 秩序回復

go.sum → 証拠保全

Goは「人を信用しない設計」
→ だからチーム開発・CI・Kubernetesと相性がいい
-
```
```
- `frontend/*` → frontend/
- 
- `admin/*` → admin/
```

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
