#!/bin/bash
# src/ ディレクトリを適切にルートに移動

cd ~/new_Go_Typescript_blog_project02/new_Go_Typescript_blog_project02/frontend

echo "=== src/ ディレクトリをルートに移動します ==="

# 1. lib ディレクトリの移動
echo "1. lib/ ディレクトリを確認中..."
if [ -d "src/lib" ]; then
    if [ -d "lib" ]; then
        echo "⚠ lib/ は既に存在します。src/lib を lib/ にマージします"
        cp -r src/lib/* lib/
    else
        cp -r src/lib lib
        echo "✓ src/lib/ → lib/ に移動"
    fi
fi

# 2. types ディレクトリの移動
echo "2. types/ ディレクトリを確認中..."
if [ -d "src/types" ]; then
    if [ -d "types" ]; then
        echo "⚠ types/ は既に存在します。src/types を types/ にマージします"
        cp -r src/types/* types/
    else
        cp -r src/types types
        echo "✓ src/types/ → types/ に移動"
    fi
fi

# 3. components のマージ（重複確認）
echo "3. components/ を統合中..."
if [ -d "src/components" ]; then
    # CommentSection.tsx
    if [ -f "src/components/CommentSection.tsx" ] && [ ! -f "components/CommentSection.tsx" ]; then
        cp src/components/CommentSection.tsx components/
        echo "✓ CommentSection.tsx を追加"
    fi
    
    # Header.tsx
    if [ -f "src/components/Header.tsx" ] && [ ! -f "components/Header.tsx" ]; then
        cp src/components/Header.tsx components/
        echo "✓ Header.tsx を追加"
    fi
    
    # Footer.tsx
    if [ -f "src/components/Footer.tsx" ] && [ ! -f "components/Footer.tsx" ]; then
        cp src/components/Footer.tsx components/
        echo "✓ Footer.tsx を追加"
    fi
    
    # FeaturedPosts.tsx - 2つ存在する場合
    if [ -f "src/components/FeaturedPosts.tsx" ]; then
        if [ -f "components/FeaturedPosts.tsx" ]; then
            echo "⚠ FeaturedPosts.tsx が2箇所に存在"
            echo "  どちらが新しいか確認してください："
            ls -l components/FeaturedPosts.tsx
            ls -l src/components/FeaturedPosts.tsx
            cp src/components/FeaturedPosts.tsx components/FeaturedPosts.src-backup.tsx
            echo "  src版を FeaturedPosts.src-backup.tsx として保存"
        else
            cp src/components/FeaturedPosts.tsx components/
            echo "✓ FeaturedPosts.tsx を追加"
        fi
    fi
fi

# 4. src/ を完全にバックアップ
echo "4. src/ をバックアップ中..."
if [ -d "src" ]; then
    if [ -d "src.backup" ]; then
        rm -rf src.backup
    fi
    mv src src.backup
    echo "✓ src/ を src.backup/ に移動"
fi

# 5. src/app.back も確認
if [ -d "src.backup/app.back" ]; then
    echo "⚠ src.backup/app.back/ も存在します（App Routerの残骸）"
fi

# 6. 最終的なディレクトリ構造を表示
echo ""
echo "=== 移動完了！最終的なディレクトリ構造 ==="
echo ""
echo "📁 components/"
ls -1 components/ | sed 's/^/  /'
echo ""
echo "📁 lib/"
if [ -d "lib" ]; then
    ls -1 lib/ | sed 's/^/  /'
else
    echo "  (なし)"
fi
echo ""
echo "📁 types/"
if [ -d "types" ]; then
    ls -1 types/ | sed 's/^/  /'
else
    echo "  (なし)"
fi
echo ""
echo "📁 contexts/"
ls -1 contexts/ | sed 's/^/  /'
echo ""
echo "📁 hoc/"
ls -1 hoc/ | sed 's/^/  /'

echo ""
echo "=== 完了 ==="
echo ""
echo "次の手順："
echo "1. tsconfig.json の paths を確認"
echo "2. pages/ からの import パスを確認"
echo "3. docker-compose restart frontend"
echo "4. docker-compose logs -f frontend"
