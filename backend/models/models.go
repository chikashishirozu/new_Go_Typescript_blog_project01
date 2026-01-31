package models

import (
	"time"
)

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Posts        []Post    `gorm:"foreignKey:UserID" json:"posts,omitempty"`
}

type Category struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Slug      string    `gorm:"uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time `json:"created_at"`
	Posts     []Post    `gorm:"many2many:post_categories;" json:"posts,omitempty"`
}

type Tag struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Slug      string    `gorm:"uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time `json:"created_at"`
	Posts     []Post    `gorm:"many2many:post_tags;" json:"posts,omitempty"`
}

type Post struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	Title      string     `gorm:"not null" json:"title"`
	Slug       string     `gorm:"uniqueIndex;not null" json:"slug"`
	Content    string     `gorm:"type:text" json:"content"`
	UserID     uint       `gorm:"not null" json:"user_id"`
	User       User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Categories []Category `gorm:"many2many:post_categories;" json:"categories,omitempty"`
	Tags       []Tag      `gorm:"many2many:post_tags;" json:"tags,omitempty"`
	Comments   []Comment  `gorm:"foreignKey:PostID" json:"comments,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

type Comment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	PostID    uint      `gorm:"not null" json:"post_id"`
	Post      Post      `gorm:"foreignKey:PostID" json:"post,omitempty"`
	Author    string    `gorm:"not null" json:"author"`
	Email     string    `gorm:"not null" json:"email"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	Approved  bool      `gorm:"default:false" json:"approved"`
	CreatedAt time.Time `json:"created_at"`
}
