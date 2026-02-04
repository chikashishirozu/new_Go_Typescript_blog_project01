#!/bin/bash
# 最小限の修正のみ実行（既存の _app.tsx は維持）

cd ~/new_Go_Typescript_blog_project02/new_Go_Typescript_blog_project02/frontend

echo "=== 最小限の修正を実行します ==="

# 1. pages/blog/page.tsx → pages/blog/index.tsx
echo "1. blog ファイルをリネーム中..."
if [ -f "pages/blog/page.tsx" ]; then
    mv pages/blog/page.tsx pages/blog/index.tsx
    echo "✓ pages/blog/index.tsx に変更"
fi

# 2. pages/blog/[slug]/page.tsx → pages/blog/[slug].tsx
if [ -f "pages/blog/[slug]/page.tsx" ]; then
    mv pages/blog/[slug]/page.tsx pages/blog/[slug].tsx
    rmdir pages/blog/[slug] 2>/dev/null
    echo "✓ pages/blog/[slug].tsx に変更"
fi

# 3. 不要な layout.tsx を削除
if [ -f "pages/layout.tsx" ]; then
    rm pages/layout.tsx
    echo "✓ pages/layout.tsx を削除"
fi

# 4. next.config.js から swcMinify を削除
echo "2. next.config.js を確認中..."
if grep -q "swcMinify" next.config.js 2>/dev/null; then
    sed -i '/swcMinify/d' next.config.js
    echo "✓ next.config.js から swcMinify を削除"
fi

# 5. styles/globals.css が存在するか確認
if [ ! -f "styles/globals.css" ]; then
    if [ -f "src/app.back/globals.css" ]; then
        mkdir -p styles
        cp src/app.back/globals.css styles/globals.css
        echo "✓ styles/globals.css を作成"
    else
        mkdir -p styles
        cat > styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
        echo "✓ styles/globals.css を作成"
    fi
fi

echo ""
echo "=== 完了 ==="
echo ""
echo "次のコマンドを実行："
echo "cd ~/new_Go_Typescript_blog_project02/new_Go_Typescript_blog_project02"
echo "docker-compose restart frontend"
echo "docker-compose logs -f frontend"
