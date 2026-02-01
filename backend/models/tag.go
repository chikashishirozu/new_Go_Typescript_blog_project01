package models

import (
	"time"
	"gorm.io/gorm"
)

type Tag struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Name string `gorm:"uniqueIndex;not null" json:"name"`
	Slug string `gorm:"uniqueIndex;not null" json:"slug"`
	
	Posts []Post `gorm:"many2many:post_tags;" json:"-"`
}

func (Tag) TableName() string {
	return "tags"
}