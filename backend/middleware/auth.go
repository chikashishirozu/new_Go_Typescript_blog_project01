package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header required",
			})
			c.Abort()
			return
		}

		// Bearer トークンの形式をチェック
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization header format",
			})
			c.Abort()
			return
		}

		token := parts[1]

		// TODO: JWTトークンの検証を実装
		// 現在はダミーの実装
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			c.Abort()
			return
		}

		// トークンが有効な場合、ユーザー情報をコンテキストにセット
		c.Set("user_id", "1")
		c.Set("user_email", "test@example.com")
		c.Set("user_role", "admin") // TODO: トークンから実際のロールを取得

		c.Next()
	}
}
