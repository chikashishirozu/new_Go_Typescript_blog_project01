package handlers

import (
	"blogapp/config"
	"blogapp/utils"
	"net/http"
	
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db     *gorm.DB
	config *config.Config
	jwt    *utils.JWT
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewAuthHandler(db *gorm.DB, config *config.Config, jwt *utils.JWT) *AuthHandler {
	return &AuthHandler{
		db:     db,
		config: config,
		jwt:    jwt,
	}
}

// Login ログイン処理
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}
	
	// TODO: 実際の認証ロジック
	// ここではダミーデータを返す
	token, err := h.jwt.GenerateToken("1", "test@example.com")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":    1,
			"email": "test@example.com",
			"name":  "Test User",
		},
	})
}

// Register 新規登録
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}
	
	// TODO: 実際の登録ロジック
	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
		"user": gin.H{
			"username": req.Username,
			"email":    req.Email,
		},
	})
}

// Logout ログアウト
func (h *AuthHandler) Logout(c *gin.Context) {
	// JWTはクライアント側で削除するので、サーバー側では特にすることはない
	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}
