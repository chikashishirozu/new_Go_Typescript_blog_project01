package database

import (
	"blogapp/models"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedData は初期データを投入
func SeedData(db *gorm.DB) error {
	log.Println("Seeding database...")
	
	// 1. 管理者ユーザーの作成
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	
	adminUser := &models.User{
		Email:             "admin@example.com",
		Username:          "admin",
		Password:          string(hashedPassword),
		DisplayName:       "管理者",
		IsAdmin:           true,
		IsVerified:        true,
		PasswordChangedAt: time.Now(),
	}
	
	// 既存の管理者をチェック
	var count int64
	db.Model(&models.User{}).Where("email = ?", adminUser.Email).Count(&count)
	if count == 0 {
		if err := db.Create(adminUser).Error; err != nil {
			return err
		}
		log.Println("Admin user created")
	}
	
	// 管理者のIDを取得（作成後）
	var admin models.User
	if err := db.Where("email = ?", "admin@example.com").First(&admin).Error; err != nil {
		return err
	}
	
	// 2. テストユーザー作成
	testUser := &models.User{
		Email:             "user@example.com",
		Username:          "testuser",
		Password:          string(hashedPassword), // 実際は別のパスワードを設定
		DisplayName:       "テストユーザー",
		IsAdmin:           false,
		IsVerified:        true,
		PasswordChangedAt: time.Now(),
	}
	
	db.Model(&models.User{}).Where("email = ?", testUser.Email).Count(&count)
	if count == 0 {
		if err := db.Create(testUser).Error; err != nil {
			return err
		}
		log.Println("Test user created")
	}
	
	// 3. カテゴリー作成
	categories := []models.Category{
		{Name: "技術", Slug: "technology", Description: "技術関連の記事"},
		{Name: "生活", Slug: "life", Description: "日常生活の記事"},
		{Name: "旅行", Slug: "travel", Description: "旅行関連の記事"},
		{Name: "料理", Slug: "cooking", Description: "料理関連の記事"},
	}
	
	var categoryIDs []uint
	for _, category := range categories {
		var existingCategory models.Category
		if err := db.Where("slug = ?", category.Slug).First(&existingCategory).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&category).Error; err != nil {
					return err
				}
				categoryIDs = append(categoryIDs, category.ID)
			} else {
				return err
			}
		} else {
			categoryIDs = append(categoryIDs, existingCategory.ID)
		}
	}
	log.Println("Categories created")
	
	// 4. タグ作成
	tags := []models.Tag{
		{Name: "Go", Slug: "go"},
		{Name: "TypeScript", Slug: "typescript"},
		{Name: "React", Slug: "react"},
		{Name: "Docker", Slug: "docker"},
		{Name: "Tips", Slug: "tips"},
	}
	
	var tagIDs []uint
	for _, tag := range tags {
		var existingTag models.Tag
		if err := db.Where("slug = ?", tag.Slug).First(&existingTag).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&tag).Error; err != nil {
					return err
				}
				tagIDs = append(tagIDs, tag.ID)
			} else {
				return err
			}
		} else {
			tagIDs = append(tagIDs, existingTag.ID)
		}
	}
	log.Println("Tags created")
	
	// 5. サンプル投稿作成
	samplePosts := []models.Post{
		{
			Title:     "Go言語入門",
			Slug:      "go-introduction",
			Content:   "Go言語はGoogleが開発したプログラミング言語です。シンプルで効率的なコードを書くことができます。",
			Excerpt:   "Go言語の基本的な使い方を解説します。",
			Published: true,
			AuthorID:  admin.ID,
			CategoryID: categoryIDs[0], // 技術カテゴリー
		},
		{
			Title:     "ReactとTypeScriptの組み合わせ",
			Slug:      "react-typescript",
			Content:   "ReactとTypeScriptを組み合わせることで、型安全でメンテナンスしやすいフロントエンド開発が可能になります。",
			Excerpt:   "React+TypeScriptの始め方",
			Published: true,
			AuthorID:  admin.ID,
			CategoryID: categoryIDs[0], // 技術カテゴリー
		},
		{
			Title:     "おすすめの旅行先",
			Slug:      "recommended-travel",
			Content:   "今年のおすすめ旅行先を紹介します。自然豊かな場所から都会の観光地まで様々です。",
			Excerpt:   "旅行好き必見のおすすめスポット",
			Published: true,
			AuthorID:  admin.ID,
			CategoryID: categoryIDs[2], // 旅行カテゴリー
		},
	}
	
	for _, post := range samplePosts {
		var existingPost models.Post
		if err := db.Where("slug = ?", post.Slug).First(&existingPost).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// 投稿を作成
				if err := db.Create(&post).Error; err != nil {
					return err
				}
				
				// タグの関連付け（最初の投稿にGoタグ、2番目にReactタグなど）
				if post.Slug == "go-introduction" && len(tagIDs) > 0 {
					db.Model(&post).Association("Tags").Append(&models.Tag{ID: tagIDs[0]}) // Goタグ
				} else if post.Slug == "react-typescript" && len(tagIDs) > 1 {
					db.Model(&post).Association("Tags").Append(&models.Tag{ID: tagIDs[2]}) // Reactタグ
				}
				
				log.Printf("Post created: %s", post.Title)
			} else {
				return err
			}
		}
	}
	log.Println("Sample posts created")
	
	// 6. サンプルコメント作成（オプション）
	// 最初の投稿にコメントを追加
	var firstPost models.Post
	if err := db.Where("slug = ?", "go-introduction").First(&firstPost).Error; err == nil {
		comment := models.Comment{
			PostID:   firstPost.ID,
			Author:   "読者A",
			Email:    "reader@example.com",
			Content:  "とても参考になりました！",
			Approved: true,
		}
		
		if err := db.Create(&comment).Error; err != nil {
			log.Printf("Failed to create comment: %v", err)
		} else {
			log.Println("Sample comment created")
		}
	}
	
	log.Println("Seeding completed successfully")
	return nil
}