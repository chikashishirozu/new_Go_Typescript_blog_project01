package handlers

import (
	"net/http"
	
	"github.com/gin-gonic/gin"
)

// GetCategories すべてのカテゴリーを取得
func GetCategories(c *gin.Context) {
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"categories": []gin.H{
			{
				"id":   1,
				"name": "Technology",
				"slug": "technology",
			},
			{
				"id":   2,
				"name": "Programming",
				"slug": "programming",
			},
		},
	})
}

// GetCategory IDでカテゴリーを取得
func GetCategory(c *gin.Context) {
	id := c.Param("id")
	// TODO: 実際のデータベースから取得
	c.JSON(http.StatusOK, gin.H{
		"category": gin.H{
			"id":   id,
			"name": "Technology",
			"slug": "technology",
		},
	})
}

// CreateCategory 新しいカテゴリーを作成
func CreateCategory(c *gin.Context) {
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
		"message": "Category created successfully",
		"category": gin.H{
			"id":   1,
			"name": req.Name,
			"slug": req.Slug,
		},
	})
}

// UpdateCategory カテゴリーを更新
func UpdateCategory(c *gin.Context) {
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
		"message": "Category updated successfully",
		"category": gin.H{
			"id":   id,
			"name": req.Name,
			"slug": req.Slug,
		},
	})
}

// DeleteCategory カテゴリーを削除
func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	
	// TODO: 実際のデータベースから削除
	c.JSON(http.StatusOK, gin.H{
		"message": "Category deleted successfully",
		"id":      id,
	})
}
