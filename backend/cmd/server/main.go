// cmd/server/main.go
package main

import (
	"blogapp/config"
	"blogapp/database"
	"blogapp/handlers"
	"blogapp/routes"
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// マイグレーション実行（オプション）
	if os.Getenv("AUTO_MIGRATE") == "true" {
		if err := database.AutoMigrate(db); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}
		
		// シードデータ投入（オプション）
		if os.Getenv("SEED_DATA") == "true" {
			if err := database.SeedData(db); err != nil {
				log.Fatalf("Failed to seed data: %v", err)
			}
		}
	}

	// Ginのセットアップ
	router := gin.Default()

	// CORS設定を環境変数から読み取る
	allowedOrigins := []string{"http://localhost:3006", "http://localhost:3007"}
	if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
		allowedOrigins = strings.Split(envOrigins, ",")
	}

	log.Printf("CORS allowed origins: %v", allowedOrigins)

	// CORS設定
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // 12時間
	}))

	// Setup routes
	routes.SetupRoutes(router)

	// Start server
	addr := "0.0.0.0:" + cfg.Port
	log.Printf("Server starting on %s", addr)
	log.Printf("Server will listen on all interfaces")
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
