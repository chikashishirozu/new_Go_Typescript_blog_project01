# Go 1.22（asdf と揃えているのはとても良い）
FROM golang:1.24-alpine

# 必要最低限のツール
RUN apk add --no-cache git

# 作業ディレクトリ
WORKDIR /app

# Go Modules だけ先にコピー（キャッシュ効かせる）
COPY go.mod go.sum ./
RUN go mod download

# air をインストール（ホットリロード）
RUN go install github.com/air-verse/air@v1.52.3

# ソースコード
COPY . .

# air のポート（Go API）
EXPOSE 8080

# docker-compose 側で command を指定しているので CMD は不要

