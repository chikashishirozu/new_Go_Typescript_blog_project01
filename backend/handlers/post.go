package handlers

import (
	"net/http"
	
	"github.com/gin-gonic/gin"
)

// GetPosts すべての投稿を取得
func GetPosts(c *gin.Context) {
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"posts": []gin.H{
			{
				"id":    1,
				"title": "Sample Post",
				"slug":  "sample-post",
			},
		},
	})
}

// GetPost IDで投稿を取得
func GetPost(c *gin.Context) {
	id := c.Param("id")
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"post": gin.H{
			"id":    id,
			"title": "Sample Post",
			"slug":  "sample-post",
		},
	})
}

// GetPostBySlug スラッグで投稿を取得
func GetPostBySlug(c *gin.Context) {
	slug := c.Param("slug")
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"post": gin.H{
			"id":    1,
			"title": "Sample Post",
			"slug":  slug,
		},
	})
}

// CreatePost 新しい投稿を作成
func CreatePost(c *gin.Context) {
	var req struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content" binding:"required"`
		Slug    string `json:"slug" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースに保存
	c.JSON(http.StatusCreated, gin.H{
		"message": "Post created successfully",
		"post": gin.H{
			"id":      1,
			"title":   req.Title,
			"content": req.Content,
			"slug":    req.Slug,
		},
	})
}

// UpdatePost 投稿を更新
func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Slug    string `json:"slug"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースを更新
	c.JSON(http.StatusOK, gin.H{
		"message": "Post updated successfully",
		"post": gin.H{
			"id":      id,
			"title":   req.Title,
			"content": req.Content,
			"slug":    req.Slug,
		},
	})
}

// DeletePost 投稿を削除
func DeletePost(c *gin.Context) {
	id := c.Param("id")
	
	// TODO: 実際のデータベースから削除
	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted successfully",
		"id":      id,
	})
}
