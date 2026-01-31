// handlers/comment.go
package handlers

import (
	"net/http"
	"blogapp/models"
	"blogapp/utils"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type CommentHandler struct {
	db *gorm.DB
}

func NewCommentHandler(db *gorm.DB) *CommentHandler {
	return &CommentHandler{db: db}
}

func (h *CommentHandler) ListByPost(c echo.Context) error {
	postID := c.Param("postId")
	var comments []models.Comment
	query := h.db.Where("post_id = ?", postID)
	
	if !isAdmin(c) {
		query = query.Where("approved = ?", true)
	}
	
	if err := query.Order("created_at desc").Find(&comments).Error; err != nil {
		return utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch comments")
	}
	return utils.SuccessResponse(c, http.StatusOK, comments)
}

func (h *CommentHandler) Create(c echo.Context) error {
	var req struct {
		Content string `json:"content" validate:"required"`
		Author  string `json:"author" validate:"required"`
		Email   string `json:"email" validate:"required,email"`
		PostID  uint   `json:"post_id" validate:"required"`
	}
	if err := c.Bind(&req); err != nil {
		return utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
	}

	comment := &models.Comment{
		Content:  req.Content,
		Author:   req.Author,
		Email:    req.Email,
		PostID:   req.PostID,
		Approved: false,
	}

	if err := h.db.Create(comment).Error; err != nil {
		return utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create comment")
	}
	return utils.SuccessResponse(c, http.StatusCreated, comment)
}

func (h *CommentHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := h.db.Delete(&models.Comment{}, id).Error; err != nil {
		return utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete comment")
	}
	return utils.SuccessResponse(c, http.StatusOK, map[string]string{"message": "Comment deleted"})
}

// isAdmin ユーザーが管理者かどうかを確認 (Echo用)
func isAdmin(c echo.Context) bool {
	// TODO: 実際の認証ロジック
	// JWTミドルウェアでセットされたユーザー情報を確認
	userRole := c.Get("user_role")
	if userRole == nil {
		return false
	}
	
	role, ok := userRole.(string)
	if !ok {
		return false
	}
	
	return role == "admin"
}
