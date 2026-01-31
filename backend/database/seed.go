package database

import (
	"log"

	"gorm.io/gorm"
)

// SeedData は初期データを投入
func SeedData(db *gorm.DB) error {
	log.Println("Seeding database...")
	
	// TODO: 実際のシードデータを実装
	// 例:
	// user := &models.User{
	// 	Username: "admin",
	// 	Email: "admin@example.com",
	// 	PasswordHash: "$2a$10$...", // bcryptでハッシュ化
	// }
	// if err := db.Create(user).Error; err != nil {
	// 	return err
	// }
	
	log.Println("Seeding completed successfully")
	return nil
}
