package models

import (
	"time"
	"gorm.io/gorm"
)

type Post struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
	
	Title     string `gorm:"not null" json:"title"`
	Slug      string `gorm:"uniqueIndex;not null" json:"slug"`
	Content   string `gorm:"type:text" json:"content"`
	Excerpt   string `json:"excerpt"`
	ImageURL  string `json:"image_url"`
	Published bool   `gorm:"default:false" json:"published"`
	
	// 外部キー
	AuthorID   uint `gorm:"not null" json:"author_id"`
	CategoryID uint `json:"category_id"`
	
	// リレーション
	Author   User     `gorm:"foreignKey:AuthorID" json:"author"`
	Category Category `gorm:"foreignKey:CategoryID" json:"category"`
	Tags     []Tag    `gorm:"many2many:post_tags;" json:"tags"`
	Comments []Comment `gorm:"foreignKey:PostID" json:"comments"`
}

func (Post) TableName() string {
	return "posts"
}