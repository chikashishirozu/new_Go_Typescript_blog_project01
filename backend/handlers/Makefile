.PHONY: run migrate-up migrate-down migrate-create build docker-build docker-up docker-down clean test

run:
	go run main.go

# Dockerコンテナ内でマイグレーションを実行
migrate-up:
	docker compose exec backend go run cmd/migrate/main.go up

migrate-down:
	docker compose exec backend go run cmd/migrate/main.go down

migrate-reset:
	docker compose exec backend go run cmd/migrate/main.go reset

migrate-seed:
	docker compose exec backend go run cmd/migrate/main.go seed

migrate-create:
	@read -p "Enter migration name: " name; \
	docker compose exec backend go run cmd/migrate/main.go create $$name

build:
	go build -o bin/blogapp main.go

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

clean:
	rm -rf bin/
	rm -rf tmp/
	rm -rf uploads/*

test:
	go test -v ./...

# ローカル開発用（ホストから実行する場合）
local-migrate-up:
	go run cmd/migrate/main.go up

local-migrate-down:
	go run cmd/migrate/main.go down

.DEFAULT_GOAL := run
