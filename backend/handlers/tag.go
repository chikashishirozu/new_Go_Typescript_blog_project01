package handlers

import (
	"net/http"
	
	"github.com/gin-gonic/gin"
)

// GetTags すべてのタグを取得
func GetTags(c *gin.Context) {
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"tags": []gin.H{
			{
				"id":   1,
				"name": "Go",
				"slug": "go",
			},
			{
				"id":   2,
				"name": "TypeScript",
				"slug": "typescript",
			},
		},
	})
}

// GetTag IDでタグを取得
func GetTag(c *gin.Context) {
	id := c.Param("id")
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"tag": gin.H{
			"id":   id,
			"name": "Go",
			"slug": "go",
		},
	})
}

// CreateTag 新しいタグを作成
func CreateTag(c *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required"`
		Slug string `json:"slug" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースに保存
	c.JSON(http.StatusCreated, gin.H{
		"message": "Tag created successfully",
		"tag": gin.H{
			"id":   1,
			"name": req.Name,
			"slug": req.Slug,
		},
	})
}

// UpdateTag タグを更新
func UpdateTag(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	// TODO: 実際のデータベースを更新
	c.JSON(http.StatusOK, gin.H{
		"message": "Tag updated successfully",
		"tag": gin.H{
			"id":   id,
			"name": req.Name,
			"slug": req.Slug,
		},
	})
}

// DeleteTag タグを削除
func DeleteTag(c *gin.Context) {
	id := c.Param("id")
	
	// TODO: 実際のデータベースから削除
	c.JSON(http.StatusOK, gin.H{
		"message": "Tag deleted successfully",
		"id":      id,
	})
}
