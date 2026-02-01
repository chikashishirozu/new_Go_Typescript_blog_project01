package database

import (
	"blogapp/config"
	"blogapp/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect はデータベースに接続
func Connect(databaseURL string) (*gorm.DB, error) {
	var err error
	
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	
	log.Println("Successfully connected to database")
	return DB, nil
}

// Init は設定を使用してデータベースを初期化
func Init(cfg *config.Config) error {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
	)
	
	var err error
	DB, err = Connect(dsn)
	return err
}

// GetDB はデータベースインスタンスを取得
func GetDB() *gorm.DB {
	return DB
}

// AutoMigrate はデータベースのマイグレーションを実行
func AutoMigrate(db *gorm.DB) error {
	log.Println("Running database migrations...")
	
	err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Tag{},
		&models.Post{},
		&models.Comment{},
	)
	
	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}
	
	log.Println("Migrations completed successfully")
	return nil
}

