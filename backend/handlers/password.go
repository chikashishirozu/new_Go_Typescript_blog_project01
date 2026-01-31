package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"blogapp/models"
)

type PasswordHandler struct {
	DB *gorm.DB
}

// ChangePasswordRequest - パスワード変更リクエスト（ログイン中）
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

// ForgotPasswordRequest - パスワードリセットリクエスト
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest - パスワードリセット実行リクエスト
type ResetPasswordRequest struct {
	Token           string `json:"token" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

// ChangePassword - パスワード変更（ログイン中のユーザー）
func (h *PasswordHandler) ChangePassword(c *gin.Context) {
	// ミドルウェアで設定されたユーザーID取得
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "認証が必要です",
		})
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "入力内容を確認してください",
		})
		return
	}

	// 新しいパスワードの確認
	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "新しいパスワードが一致しません",
		})
		return
	}

	// 現在のパスワードと同じでないか確認
	if req.CurrentPassword == req.NewPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "現在のパスワードと異なるパスワードを設定してください",
		})
		return
	}

	// パスワード強度チェック
	if err := validatePassword(req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// ユーザー情報取得
	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "ユーザーが見つかりません",
		})
		return
	}

	// 現在のパスワード検証
	if !user.CheckPassword(req.CurrentPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "現在のパスワードが正しくありません",
		})
		return
	}

	// 新しいパスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.NewPassword),
		bcrypt.DefaultCost,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "パスワードの暗号化に失敗しました",
		})
		return
	}

	// パスワード更新
	user.Password = string(hashedPassword)
	user.PasswordChangedAt = time.Now()

	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "パスワードの更新に失敗しました",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "パスワードを変更しました",
	})
}

// ForgotPassword - パスワードリセットリクエスト（メール送信）
func (h *PasswordHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "メールアドレスを入力してください",
		})
		return
	}

	// ユーザー検索
	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		// セキュリティのため、ユーザーが存在しなくても成功レスポンスを返す
		c.JSON(http.StatusOK, gin.H{
			"message": "パスワードリセット用のメールを送信しました",
		})
		return
	}

	// リセットトークン生成（32バイトのランダム文字列）
	token, err := generateSecureToken(32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "トークンの生成に失敗しました",
		})
		return
	}

	// トークンをハッシュ化して保存（DBには平文を保存しない）
	hashedToken, err := bcrypt.GenerateFromPassword(
		[]byte(token),
		bcrypt.DefaultCost,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "トークンの暗号化に失敗しました",
		})
		return
	}

	// トークンとその有効期限を保存（1時間）
	user.ResetPasswordToken = string(hashedToken)
	user.ResetPasswordExpires = time.Now().Add(1 * time.Hour)

	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "トークンの保存に失敗しました",
		})
		return
	}

	// メール送信（実装例）
	resetURL := fmt.Sprintf("http://localhost:3000/reset-password?token=%s", token)
	
	// TODO: 実際のメール送信処理を実装
	// SendEmail(user.Email, "パスワードリセット", resetURL)
	
	// 開発環境ではログに出力
	fmt.Printf("\n=== パスワードリセットURL ===\n")
	fmt.Printf("ユーザー: %s (%s)\n", user.Username, user.Email)
	fmt.Printf("URL: %s\n", resetURL)
	fmt.Printf("有効期限: %s\n", user.ResetPasswordExpires.Format("2006-01-02 15:04:05"))
	fmt.Printf("==============================\n\n")

	c.JSON(http.StatusOK, gin.H{
		"message": "パスワードリセット用のメールを送信しました",
		// 開発環境のみ: トークンを返す（本番では削除）
		"dev_reset_url": resetURL,
	})
}

// ResetPassword - パスワードリセット実行
func (h *PasswordHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "入力内容を確認してください",
		})
		return
	}

	// 新しいパスワードの確認
	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "パスワードが一致しません",
		})
		return
	}

	// パスワード強度チェック
	if err := validatePassword(req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// トークンを持つユーザーを検索（有効期限内）
	var users []models.User
	if err := h.DB.Where(
		"reset_password_token IS NOT NULL AND reset_password_expires > ?",
		time.Now(),
	).Find(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "無効または期限切れのトークンです",
		})
		return
	}

	// トークンをハッシュと照合
	var matchedUser *models.User
	for i := range users {
		if bcrypt.CompareHashAndPassword(
			[]byte(users[i].ResetPasswordToken),
			[]byte(req.Token),
		) == nil {
			matchedUser = &users[i]
			break
		}
	}

	if matchedUser == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "無効または期限切れのトークンです",
		})
		return
	}

	// 新しいパスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.NewPassword),
		bcrypt.DefaultCost,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "パスワードの暗号化に失敗しました",
		})
		return
	}

	// パスワード更新とトークン削除
	matchedUser.Password = string(hashedPassword)
	matchedUser.PasswordChangedAt = time.Now()
	matchedUser.ResetPasswordToken = ""
	matchedUser.ResetPasswordExpires = time.Time{}

	if err := h.DB.Save(matchedUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "パスワードの更新に失敗しました",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "パスワードをリセットしました。新しいパスワードでログインしてください。",
	})
}

// VerifyResetToken - リセットトークンの有効性確認（オプション）
func (h *PasswordHandler) VerifyResetToken(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "トークンが指定されていません",
		})
		return
	}

	// トークンを持つユーザーを検索
	var users []models.User
	if err := h.DB.Where(
		"reset_password_token IS NOT NULL AND reset_password_expires > ?",
		time.Now(),
	).Find(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"valid": false,
			"error": "無効または期限切れのトークンです",
		})
		return
	}

	// トークンをハッシュと照合
	for i := range users {
		if bcrypt.CompareHashAndPassword(
			[]byte(users[i].ResetPasswordToken),
			[]byte(token),
		) == nil {
			c.JSON(http.StatusOK, gin.H{
				"valid":      true,
				"expires_at": users[i].ResetPasswordExpires,
			})
			return
		}
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"valid": false,
		"error": "無効または期限切れのトークンです",
	})
}

// ユーティリティ関数

// generateSecureToken - 安全なランダムトークン生成
func generateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// validatePassword - パスワード強度チェック（再利用）
func validatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("パスワードは8文字以上必要です")
	}

	// 英字を含むか
	hasLetter := false
	for _, c := range password {
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') {
			hasLetter = true
			break
		}
	}

	// 数字を含むか
	hasNumber := false
	for _, c := range password {
		if c >= '0' && c <= '9' {
			hasNumber = true
			break
		}
	}

	if !hasLetter || !hasNumber {
		return fmt.Errorf("パスワードは英字と数字を含む必要があります")
	}

	return nil
}
