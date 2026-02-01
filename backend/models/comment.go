package models

import (
	"time"
	"gorm.io/gorm"
)

type Comment struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	PostID   uint   `gorm:"not null" json:"post_id"`
	Author   string `gorm:"not null" json:"author"`
	Email    string `gorm:"not null" json:"email"`
	Content  string `gorm:"type:text;not null" json:"content"`
	Approved bool   `gorm:"default:false" json:"approved"`
	
	Post Post `gorm:"foreignKey:PostID" json:"post"`
}

func (Comment) TableName() string {
	return "comments"
}