package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// 基本情報
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Username string `gorm:"uniqueIndex;not null" json:"username"`
	Password string `gorm:"not null" json:"-"` // JSONには含めない

	// プロフィール
	DisplayName string `json:"display_name"`
	Bio         string `json:"bio"`
	Avatar      string `json:"avatar"`

	// 権限
	IsAdmin    bool `gorm:"default:false" json:"is_admin"`
	IsVerified bool `gorm:"default:false" json:"is_verified"`

	// パスワードリセット用
	ResetPasswordToken   string    `gorm:"index" json:"-"`
	ResetPasswordExpires time.Time `json:"-"`
	PasswordChangedAt    time.Time `json:"password_changed_at"`

	// リレーション
	Posts []Post `gorm:"foreignKey:AuthorID" json:"-"`
}

// BeforeCreate - パスワードのハッシュ化（作成前フック）
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(u.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
		u.PasswordChangedAt = time.Now()
	}
	return nil
}

// CheckPassword - パスワード検証
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword(
		[]byte(u.Password),
		[]byte(password),
	)
	return err == nil
}

// TableName - テーブル名を明示的に指定
func (User) TableName() string {
	return "users"
}
