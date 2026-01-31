package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	
 "gorm.io/gorm"	

	"blogapp/config"
	"blogapp/database"
	"blogapp/models"
)

func main() {
	// コマンドラインフラグ
	action := flag.String("action", "up", "Migration action: up, down, reset, seed")
	flag.Parse()

	// 設定読み込み
	cfg := config.LoadConfig()

	// DB接続
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}
	defer sqlDB.Close()

	// アクション実行
	switch *action {
	case "up":
		migrateUp(db)
	case "down":
		migrateDown(db)
	case "reset":
		migrateReset(db)
	case "seed":
		seedData(db)
	default:
		fmt.Println("Invalid action. Use: up, down, reset, seed")
		os.Exit(1)
	}
}

// マイグレーション実行
func migrateUp(db *gorm.DB) {
	log.Println("Running migrations...")
	if err := database.AutoMigrate(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("✓ Migrations completed successfully")
}

// マイグレーションのロールバック
func migrateDown(db *gorm.DB) {
	log.Println("Rolling back migrations...")
	
	// テーブルを削除（逆順）
	tables := []interface{}{
		&models.Comment{},
		&models.Post{},
		&models.Tag{},
		&models.Category{},
		&models.User{},
	}

	for _, table := range tables {
		if err := db.Migrator().DropTable(table); err != nil {
			log.Printf("Warning: Failed to drop table: %v", err)
		}
	}
	
	log.Println("✓ Rollback completed")
}

// データベースリセット（削除 + 再作成）
func migrateReset(db *gorm.DB) {
	log.Println("Resetting database...")
	migrateDown(db)
	migrateUp(db)
	log.Println("✓ Database reset completed")
}

// 初期データ投入
func seedData(db *gorm.DB) {
	log.Println("Seeding data...")
	if err := database.SeedData(db); err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}
	log.Println("✓ Data seeded successfully")
}

// 状態確認関数を追加
func checkStatus(db *gorm.DB) {
	log.Println("Checking migration status...")
	
	// 各テーブルの存在確認
	tables := []struct {
		name    string
		model   interface{}
	}{
		{"users", &models.User{}},
		{"categories", &models.Category{}},
		{"posts", &models.Post{}},
		{"tags", &models.Tag{}},
		{"comments", &models.Comment{}},
		{"post_categories", &models.Post{}},
		{"post_tags", &models.Post{}},
	}

	for _, table := range tables {
		if db.Migrator().HasTable(table.model) {
			log.Printf("✓ Table '%s' exists", table.name)
		} else {
			log.Printf("✗ Table '%s' does not exist", table.name)
		}
	}
	
	// 各テーブルの行数を確認
	log.Println("\nTable row counts:")
	for _, table := range tables[:5] { // メインテーブルのみ
		var count int64
		if db.Migrator().HasTable(table.model) {
			db.Table(table.name).Count(&count)
			log.Printf("  %s: %d rows", table.name, count)
		}
	}
}
