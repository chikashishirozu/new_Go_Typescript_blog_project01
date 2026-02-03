#!/bin/bash
# ==========================================
# Blog Application - セットアップスクリプト v2
# ==========================================

set -euo pipefail

# 色定義
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

echo "=========================================="
echo "Blog Application - セットアップスクリプト v2"
echo "=========================================="
echo ""

# 警告表示
echo -e "${YELLOW}⚠  注意事項${NC}"
echo "1. 既存の .env ファイルは上書きされます"
echo "2. 生成されたパスワードは安全に保管してください"
echo "3. このスクリプトは開発環境用です"
echo "4. Vite設定ファイルも自動生成されます"
echo ""

# 確認プロンプト
read -rp "続行しますか？ [y/N]: " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "セットアップを中止しました"
    exit 0
fi

# 必要なコマンドの確認
required_commands=(openssl go docker)
for cmd in "${required_commands[@]}"; do
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${RED}エラー: $cmd が見つかりません${NC}"
        exit 1
    fi
done

# UID/GID取得
LOCAL_USER_ID=$(id -u)
LOCAL_GROUP_ID=$(id -g)

echo -e "${GREEN}[1/11] UID/GID確認${NC}"
echo "  UID: $LOCAL_USER_ID"
echo "  GID: $LOCAL_GROUP_ID"
echo ""

echo -e "${GREEN}[2/11] Adminパスワード生成${NC}"
ADMIN_PASSWORD=$(cd backend && go run ./cmd/genpass) || {
  echo -e "${RED}Adminパスワード生成失敗${NC}"
  exit 1
}
echo "  ✓ 管理者初期パスワード: $ADMIN_PASSWORD"
echo ""

echo -e "${GREEN}[3/11] pgAdminパスワード生成${NC}"
PGADMIN_PASSWORD=$(openssl rand -base64 16) || {
  echo -e "${RED}pgAdminパスワード生成失敗${NC}"
  exit 1
}
echo "  ✓ pgAdmin初期パスワード: $PGADMIN_PASSWORD"
echo ""

echo -e "${GREEN}[4/11] JWT_SECRET生成${NC}"
JWT_SECRET=$(openssl rand -base64 32) || {
  echo -e "${RED}JWT_SECRET生成失敗${NC}"
  exit 1
}
echo "  ✓ JWT_SECRET生成完了"
echo ""

echo -e "${GREEN}[5/11] POSTGRES_PASSWORD生成${NC}"
POSTGRES_PASSWORD=$(openssl rand -base64 24) || {
  echo -e "${RED}POSTGRES_PASSWORD生成失敗${NC}"
  exit 1
}
echo "  ✓ POSTGRES_PASSWORD生成完了"
echo ""

# .envファイル作成
echo -e "${GREEN}[6/11] .env ファイル作成${NC}"
cat > .env << EOF
# Docker用のUID/GID設定
LOCAL_USER_ID=$LOCAL_USER_ID
LOCAL_GROUP_ID=$LOCAL_GROUP_ID

# アプリケーション設定
ADMIN_PASSWORD=$ADMIN_PASSWORD

# PostgreSQL設定
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=blogapp

# pgAdmin設定
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=$PGADMIN_PASSWORD
EOF
echo "  ✓ .env ファイル作成完了"
chmod 600 .env
echo ""

# backend/.envファイル作成
echo -e "${GREEN}[7/11] backend/.env ファイル作成${NC}"
cat > backend/.env << EOF
DATABASE_URL=host=postgres user=bloguser password=$POSTGRES_PASSWORD dbname=blogapp port=5432 sslmode=disable
JWT_SECRET=$JWT_SECRET
PORT=8080
GIN_MODE=debug
ALLOWED_ORIGINS=http://localhost:3006,http://localhost:3007
LOG_LEVEL=debug
EOF
echo "  ✓ backend/.env ファイル作成完了"
chmod 600 backend/.env
echo ""

# frontend/.env.localファイル作成
echo -e "${GREEN}[8/11] frontend/.env.local ファイル作成${NC}"
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_NAME=ブログアプリ
NEXT_PUBLIC_SITE_URL=http://localhost:3006
EOF
echo "  ✓ frontend/.env.local ファイル作成完了"
chmod 600 frontend/.env.local
echo ""

# admin/.env ファイル作成
echo -e "${GREEN}[9/11] admin/.env ファイル作成${NC}"
cat > admin/.env << EOF
VITE_API_URL=http://localhost:8080
EOF
echo "  ✓ admin/.env ファイル作成完了"
chmod 600 admin/.env 2>/dev/null || true
echo ""

# admin/vite.config.ts 作成（重要！）
echo -e "${GREEN}[10/11] admin/vite.config.ts 作成${NC}"
if [ -d "admin" ]; then
    # 既存のvite.config.tsがある場合はバックアップ
    if [ -f "admin/vite.config.ts" ]; then
        cp admin/vite.config.ts admin/vite.config.ts.backup
        echo "  ℹ 既存のvite.config.tsをバックアップしました"
    fi
    
    cat > admin/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Docker内からアクセス可能にする（重要）
    port: 5173,
    watch: {
      usePolling: true  // Dockerでファイル変更を検知するため
    },
    strictPort: true,  // ポートが使用中の場合エラーにする
    hmr: {
      clientPort: 3007  // HMR用のポート（ホスト側のポート）
    }
  }
})
EOF
    echo "  ✓ admin/vite.config.ts 作成完了"
else
    echo -e "  ${YELLOW}警告: admin ディレクトリが見つかりません${NC}"
fi
echo ""

# ディレクトリ権限確認
echo -e "${GREEN}[11/11] ディレクトリ権限確認${NC}"
for dir in frontend admin backend; do
    if [ -d "$dir" ]; then
        OWNER=$(stat -c '%U' $dir 2>/dev/null || stat -f '%Su' $dir 2>/dev/null || echo "unknown")
        if [ "$OWNER" != "$(whoami)" ] && [ "$OWNER" != "unknown" ]; then
            echo -e "  ${YELLOW}警告: $dir の所有者が $(whoami) ではありません${NC}"
            echo "  以下のコマンドを実行してください:"
            echo "    sudo chown -R $(whoami):$(whoami) $dir"
        else
            echo "  ✓ $dir の権限OK"
        fi
    fi
done
echo ""

# SELinux確認
if command -v getenforce &> /dev/null; then
    SELINUX_STATUS=$(getenforce)
    echo -e "${YELLOW}SELinux状態: $SELINUX_STATUS${NC}"
    if [ "$SELINUX_STATUS" = "Enforcing" ]; then
        echo "  Fedora/RHELの場合、docker-compose.ymlの volumes に :z オプションが必要です"
        echo "  ✓ 現在の設定には :z が含まれています"
    fi
    echo ""
fi

echo -e "${GREEN}=========================================="
echo "セットアップ完了！"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}生成されたパスワード:${NC}"
echo "  管理者: $ADMIN_PASSWORD"
echo "  pgAdmin: $PGADMIN_PASSWORD (Email: admin@example.com)"
echo ""
echo -e "${BLUE}次のステップ:${NC}"
echo "  1. docker compose down -v"
echo "  2. docker compose up --build"
echo "  3. http://localhost:3006 でフロントエンドにアクセス"
echo "  4. http://localhost:3007 で管理画面にアクセス"
echo "  5. http://localhost:5050 でpgAdminにアクセス"
echo ""
echo -e "${BLUE}管理者ユーザー作成:${NC}"
echo "  curl -X POST http://localhost:8080/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"admin@example.com\",\"username\":\"admin\",\"password\":\"$ADMIN_PASSWORD\"}'"
echo ""
echo -e "${BLUE}管理者権限付与:${NC}"
echo "  docker exec -it blogapp_postgres psql -U bloguser -d blogapp -c \\"
echo "    \"UPDATE users SET is_admin = true WHERE email = 'admin@example.com';\""
echo ""

# セットアップ情報をファイルに保存
cat > .setup-info.txt << EOF
セットアップ情報 - $(date)
================================
管理者初期パスワード: $ADMIN_PASSWORD
pgAdmin Email: admin@example.com
pgAdmin Password: $PGADMIN_PASSWORD
JWT_SECRET: $JWT_SECRET
POSTGRES_PASSWORD: $POSTGRES_PASSWORD
================================

アクセスURL:
- フロントエンド: http://localhost:3006
- 管理画面: http://localhost:3007
- pgAdmin: http://localhost:5050
- Backend API: http://localhost:8080

⚠ このファイルは削除するか、安全な場所に移動してください
EOF
chmod 600 .setup-info.txt
echo -e "${YELLOW}情報を .setup-info.txt に保存しました${NC}"
echo ""

# .gitignore に追加
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.env$" .gitignore; then
        cat >> .gitignore << 'EOF'

# 環境変数ファイル
.env
.env.local
backend/.env
frontend/.env.local
admin/.env
admin/vite.config.ts.backup
.setup-info.txt
EOF
        echo "  ✓ .gitignore に環境変数ファイルを追加しました"
    fi
fi

echo ""
echo -e "${GREEN}🎉 すべて完了しました！${NC}"
echo ""
