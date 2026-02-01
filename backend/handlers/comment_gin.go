package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetComments 投稿に対するコメントを取得
func GetComments(c *gin.Context) {
	postID := c.Param("postId")
	
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"comments": []gin.H{
			{
				"id":        1,
				"post_id":   postID,
				"author":    "Test User",
				"content":   "Great post!",
				"approved":  true,
				"created_at": "2024-01-01T00:00:00Z",
			},
		},
	})
}

// CreateComment コメントを作成
func CreateComment(c *gin.Context) {
	var req struct {
		PostID  string `json:"post_id" binding:"required"`
		Author  string `json:"author" binding:"required"`
		Email   string `json:"email" binding:"required,email"`
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースに保存
	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment created successfully",
		"comment": gin.H{
			"post_id": req.PostID,
			"author":  req.Author,
			"email":   req.Email,
			"content": req.Content,
			"approved": false,
		},
	})
}

// UpdateComment コメントを更新
func UpdateComment(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Content  string `json:"content"`
		Approved *bool  `json:"approved"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースを更新
	c.JSON(http.StatusOK, gin.H{
		"message": "Comment updated successfully",
		"comment": gin.H{
			"id":       id,
			"content":  req.Content,
			"approved": req.Approved,
		},
	})
}

// DeleteComment コメントを削除
func DeleteComment(c *gin.Context) {
	id := c.Param("id")
	
	// TODO: 実際のデータベースから削除
	c.JSON(http.StatusOK, gin.H{
		"message": "Comment deleted successfully",
		"id":      id,
	})
}
