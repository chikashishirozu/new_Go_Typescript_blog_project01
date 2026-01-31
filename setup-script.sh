#!/bin/bash
# ==========================================
# Blog Application - セットアップスクリプト
# ==========================================

set -euo pipefail

# 色定義
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly NC='\033[0m'

echo "=========================================="
echo "Blog Application - セットアップスクリプト"
echo "=========================================="
echo ""

# 警告表示
echo -e "${YELLOW}⚠  注意事項${NC}"
echo "1. 既存の .env ファイルは上書きされます"
echo "2. 生成されたパスワードは安全に保管してください"
echo "3. このスクリプトは開発環境用です"
echo ""

# 確認プロンプト
read -rp "続行しますか？ [y/N]: " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "セットアップを中止しました"
    exit 0
fi

# 既存ファイルの確認
check_existing_files() {
    local files=(".env" "backend/.env" "frontend/.env.local" "admin/.env")
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${YELLOW}警告: $file が既に存在します${NC}"
            read -rp "上書きしますか？ [y/N]: " overwrite
            if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
                echo "既存のファイルを保持します"
                return 1
            fi
        fi
    done
    return 0
}

# UID/GID取得
LOCAL_USER_ID=$(id -u)
LOCAL_GROUP_ID=$(id -g)

echo -e "${GREEN}[1/9] UID/GID確認${NC}"
echo "  UID: $LOCAL_USER_ID"
echo "  GID: $LOCAL_GROUP_ID"
echo ""

echo -e "${GREEN}[2/9] Adminパスワード生成${NC}"
ADMIN_PASSWORD=$(go run ./cmd/genpass) || {
  echo -e "${RED}Adminパスワード生成失敗${NC}"
  exit 1
}
echo ""

echo ""
echo -e "${YELLOW}管理者初期パスワード:${NC} $ADMIN_PASSWORD"
echo "（必ず保存してください）"
echo ""


# 必要なコマンドの確認
required_commands=(openssl go docker docker-compose)
for cmd in "${required_commands[@]}"; do
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${RED}エラー: $cmd が見つかりません${NC}"
        exit 1
    fi
done


echo -e "${GREEN}[3/9] JWT_SECRET生成${NC}"
JWT_SECRET=$(openssl rand -base64 32) || {
  echo -e "${RED}JWT_SECRET生成失敗${NC}"
  exit 1
}
echo ""


echo -e "${GREEN}[4/9] POSTGRES_PASSWORD生成${NC}"
POSTGRES_PASSWORD=$(openssl rand -base64 24) || {
  echo -e "${RED}POSTGRES_PASSWORD生成失敗${NC}"
  exit 1
}
echo ""


# .envファイル作成
echo -e "${GREEN}[5/9] .env ファイル作成${NC}"
cat > .env << EOF
# Docker用のUID/GID設定
LOCAL_USER_ID=$LOCAL_USER_ID
LOCAL_GROUP_ID=$LOCAL_GROUP_ID
ADMIN_PASSWORD=$ADMIN_PASSWORD
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=blogapp
EOF
echo "  ✓ .env ファイル作成完了"
echo ""


chmod 600 .env


# backend/.envファイル作成
echo -e "${GREEN}[6/9] backend/.env ファイル作成${NC}"
cat > backend/.env << EOF
DATABASE_URL=host=postgres user=bloguser password=$POSTGRES_PASSWORD dbname=blogapp port=5432 sslmode=disable
JWT_SECRET=$JWT_SECRET
PORT=8080
GIN_MODE=debug
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=debug
EOF
echo "  ✓ backend/.env ファイル作成完了"
echo ""


chmod 600 backend/.env

# frontend/.env.localファイル作成
echo -e "${GREEN}[7/9] frontend/.env.local ファイル作成${NC}"
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_NAME=ブログアプリ
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
echo "  ✓ frontend/.env.local ファイル作成完了"
echo ""


chmod 600 frontend/.env.local 


# admin/.env ファイル作成
echo -e "${GREEN}[8/9] admin/.env ファイル作成${NC}"
cat > admin/.env << EOF
VITE_API_URL=http://localhost:8080
EOF
echo "  ✓ admin/.env ファイル作成完了"
echo ""

chmod 600 admin/.env 2>/dev/null || true

# ディレクトリ所有者確認
echo -e "${GREEN}[9/9] ディレクトリ権限確認${NC}"
for dir in frontend admin backend; do
    if [ -d "$dir" ]; then
        OWNER=$(stat -c '%U' $dir 2>/dev/null || stat -f '%Su' $dir 2>/dev/null)
        if [ "$OWNER" != "$(whoami)" ]; then
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
        echo "  例: - ./frontend:/app:z"
    fi
    echo ""
fi

echo -e "${GREEN}=========================================="
echo "セットアップ完了！"
echo "==========================================${NC}"
echo ""
echo "次のステップ:"
echo "  1. docker-compose up --build"
echo "  2. http://localhost:3000 でフロントエンドにアクセス"
echo "  3. http://localhost:3001 で管理画面にアクセス"
echo ""
echo "管理者ユーザー作成:"
echo "  curl -X POST http://localhost:8080/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"admin@example.com\",\"username\":\"admin\",\"password\":\"$ADMIN_PASSWORD\"}'"
echo ""
echo "管理者権限付与:"
echo "  docker exec -it blogapp_postgres psql -U bloguser -d blogapp -c \\"
echo "    \"UPDATE users SET is_admin = true WHERE email = 'admin@example.com';\""
echo ""

# 実行権限の確認
if [ ! -x "$0" ]; then
    echo -e "${YELLOW}ヒント: このスクリプトに実行権限を付与する場合:${NC}"
    echo "  chmod +x setup.sh"
fi

# セットアップ完了後に情報をファイルに保存
cat > .setup-info.txt << EOF
セットアップ情報 - $(date)
================================
管理者初期パスワード: $ADMIN_PASSWORD
JWT_SECRET: $JWT_SECRET
POSTGRES_PASSWORD: $POSTGRES_PASSWORD
================================
⚠ このファイルは削除するか、安全な場所に移動してください
EOF
chmod 600 .setup-info.txt
echo -e "${YELLOW}情報を .setup-info.txt に保存しました${NC}"

# .gitignore に .env 関連を追加
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.env$" .gitignore; then
        cat >> .gitignore << EOF

# 環境変数ファイル
.env
.env.local
backend/.env
frontend/.env.local
admin/.env
.setup-info.txt
EOF
        echo "  ✓ .gitignore に環境変数ファイルを追加しました"
    fi
fi
