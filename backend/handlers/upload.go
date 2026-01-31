package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadFile ファイルをアップロード
func UploadFile(c *gin.Context) {
	// フォームからファイルを取得
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No file uploaded",
		})
		return
	}

	// ファイルサイズをチェック (例: 10MB まで)
	maxSize := int64(10 << 20) // 10MB
	if file.Size > maxSize {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "File size exceeds maximum limit of 10MB",
		})
		return
	}

	// ファイル拡張子をチェック
	ext := filepath.Ext(file.Filename)
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
		".pdf":  true,
	}

	if !allowedExtensions[ext] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "File type not allowed",
		})
		return
	}

	// ユニークなファイル名を生成
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, file.Filename)
	
	// アップロードディレクトリ (TODO: 環境変数で設定)
	uploadPath := filepath.Join("./uploads", filename)

	// ファイルを保存
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save file",
		})
		return
	}

	// ファイルのURLを返す (TODO: 実際のドメインを使用)
	fileURL := fmt.Sprintf("/uploads/%s", filename)

	c.JSON(http.StatusOK, gin.H{
		"message":  "File uploaded successfully",
		"filename": filename,
		"url":      fileURL,
		"size":     file.Size,
	})
}
