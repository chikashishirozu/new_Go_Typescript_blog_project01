package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"blogapp/handlers"
	"blogapp/middleware"
	"blogapp/models"
)

func main() {
	// .envファイル読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// データベース接続
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// マイグレーション
	if err := db.AutoMigrate(&models.User{}, &models.Post{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Ginのセットアップ
	router := gin.Default()

	// CORS設定
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// ハンドラー初期化
	authHandler := &handlers.AuthHandler{DB: db}
	passwordHandler := &handlers.PasswordHandler{DB: db}

	// ルーティング設定
	api := router.Group("/api")
	{
		// 認証関連（公開）
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
		}

		// パスワードリセット関連（公開）
		password := api.Group("/password")
		{
			// パスワードを忘れた場合（メール送信）
			password.POST("/forgot", passwordHandler.ForgotPassword)
			
			// リセットトークンの有効性確認
			password.GET("/verify-token", passwordHandler.VerifyResetToken)
			
			// パスワードリセット実行
			password.POST("/reset", passwordHandler.ResetPassword)
		}

		// 認証が必要なエンドポイント
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// ユーザー情報
			protected.GET("/me", authHandler.GetMe)

			// パスワード変更（ログイン中のみ）
			protected.POST("/password/change", passwordHandler.ChangePassword)

			// 記事投稿（例）
			// protected.POST("/posts", postHandler.Create)
		}

		// 管理者のみアクセス可能
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			// 管理者用エンドポイント
			// admin.GET("/users", userHandler.List)
		}
	}

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
