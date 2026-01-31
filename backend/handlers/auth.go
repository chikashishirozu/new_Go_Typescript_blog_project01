package handlers

import (
	"net/http"
	
	"github.com/gin-gonic/gin"
)

// Register 新規登録
func Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	
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

// Login ログイン処理
func Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}
	
	// TODO: 実際の認証ロジック
	// ここではダミーのトークンを返す
	c.JSON(http.StatusOK, gin.H{
		"token": "dummy-jwt-token",
		"user": gin.H{
			"id":    1,
			"email": req.Email,
			"name":  "Test User",
		},
	})
}
