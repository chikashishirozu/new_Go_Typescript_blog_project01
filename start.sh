#!/bin/bash

# UIDは予約されているので別の変数名を使う
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)

echo "Starting with USER_ID=$USER_ID and GROUP_ID=$GROUP_ID"

# Docker Composeを起動
docker compose down -v
docker compose build --no-cache
USER_ID=0 GROUP_ID=0 docker compose up -d
