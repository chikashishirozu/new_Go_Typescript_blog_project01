package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"blogapp/config"
	"blogapp/database"
	"blogapp/handlers"
	custommw "blogapp/middleware"
)

func main() {
	// 設定の読み込み
	cfg := config.LoadConfig()

	// データベース接続
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// マイグレーション実行（環境変数で制御可能）
	autoMigrate := os.Getenv("AUTO_MIGRATE")
	if autoMigrate == "" || autoMigrate == "true" {
		if err := database.AutoMigrate(db); err != nil {
			log.Fatalf("Failed to migrate database: %v", err)
		}
		
		// 初期データ投入（オプション）
		seedData := os.Getenv("SEED_DATA")
		if seedData == "true" {
			if err := database.SeedData(db); err != nil {
				log.Printf("Warning: Failed to seed data: %v", err)
			}
		}
	} else {
		log.Println("Auto-migration is disabled")
	}

	// Echoインスタンス作成
	e := echo.New()

	// ミドルウェア設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(custommw.CORS())

	// 静的ファイル
	e.Static("/uploads", "uploads")

	// ハンドラー初期化
	authHandler := handlers.NewAuthHandler(db, cfg)
	postHandler := handlers.NewPostHandler(db)
	categoryHandler := handlers.NewCategoryHandler(db)
	tagHandler := handlers.NewTagHandler(db)
	commentHandler := handlers.NewCommentHandler(db)
	uploadHandler := handlers.NewUploadHandler()

	// ルーティング
	api := e.Group("/api")

	// 認証
	auth := api.Group("/auth")
	auth.POST("/register", authHandler.Register)
	auth.POST("/login", authHandler.Login)
	auth.GET("/me", authHandler.Me, custommw.JWTAuth(cfg.JWTSecret))

	// 投稿
	posts := api.Group("/posts")
	posts.GET("", postHandler.List)
	posts.GET("/:id", postHandler.Get)
	posts.POST("", postHandler.Create, custommw.JWTAuth(cfg.JWTSecret))
	posts.PUT("/:id", postHandler.Update, custommw.JWTAuth(cfg.JWTSecret))
	posts.DELETE("/:id", postHandler.Delete, custommw.JWTAuth(cfg.JWTSecret))
	posts.GET("/search", postHandler.Search)

	// カテゴリー
	categories := api.Group("/categories")
	categories.GET("", categoryHandler.List)
	categories.GET("/:id", categoryHandler.Get)
	categories.POST("", categoryHandler.Create, custommw.JWTAuth(cfg.JWTSecret))
	categories.PUT("/:id", categoryHandler.Update, custommw.JWTAuth(cfg.JWTSecret))
	categories.DELETE("/:id", categoryHandler.Delete, custommw.JWTAuth(cfg.JWTSecret))

	// タグ
	tags := api.Group("/tags")
	tags.GET("", tagHandler.List)
	tags.GET("/:id", tagHandler.Get)
	tags.POST("", tagHandler.Create, custommw.JWTAuth(cfg.JWTSecret))
	tags.PUT("/:id", tagHandler.Update, custommw.JWTAuth(cfg.JWTSecret))
	tags.DELETE("/:id", tagHandler.Delete, custommw.JWTAuth(cfg.JWTSecret))

	// コメント
	comments := api.Group("/comments")
	comments.GET("/post/:postId", commentHandler.ListByPost)
	comments.POST("", commentHandler.Create)
	comments.DELETE("/:id", commentHandler.Delete, custommw.JWTAuth(cfg.JWTSecret))

	// アップロード
	upload := api.Group("/upload")
	upload.POST("/image", uploadHandler.UploadImage, custommw.JWTAuth(cfg.JWTSecret))

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	e.Logger.Fatal(e.Start(":" + port))
}
