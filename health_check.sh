#!/bin/bash
# health_check.sh として保存して実行

echo "🔍 Docker コンテナヘルスチェック開始..."
echo ""

# 1. コンテナ稼働状況
echo "📦 コンテナ状態:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep blogapp

echo ""
echo "🌐 エンドポイントテスト:"

# 2. フロントエンド
if curl -sf http://localhost:3006 > /dev/null; then
    echo "✅ Frontend (3006): OK"
else
    echo "❌ Frontend (3006): FAIL"
fi

# 3. 管理画面
if curl -sf http://localhost:3007 > /dev/null; then
    echo "✅ Admin (3007): OK"
else
    echo "❌ Admin (3007): FAIL"
fi

# 4. バックエンドAPI
if curl -sf http://localhost:8080/api/posts > /dev/null; then
    echo "✅ Backend API (8080): OK"
else
    echo "❌ Backend API (8080): FAIL"
fi

# 5. pgAdmin
if curl -sf http://localhost:5050 > /dev/null; then
    echo "✅ pgAdmin (5050): OK"
else
    echo "❌ pgAdmin (5050): FAIL"
fi

# 6. PostgreSQL
if docker exec blogapp_postgres pg_isready -U bloguser -d blogapp > /dev/null 2>&1; then
    echo "✅ PostgreSQL (5432): OK"
else
    echo "❌ PostgreSQL (5432): FAIL"
fi

echo ""
echo "🎉 ヘルスチェック完了！"
