package utils

import (
	"fmt"
	"net/smtp"
	"os"
)

// EmailConfig - メール設定
type EmailConfig struct {
	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
	FromName     string
}

// GetEmailConfig - 環境変数からメール設定を取得
func GetEmailConfig() *EmailConfig {
	return &EmailConfig{
		SMTPHost:     os.Getenv("SMTP_HOST"),     // 例: smtp.gmail.com
		SMTPPort:     os.Getenv("SMTP_PORT"),     // 例: 587
		SMTPUsername: os.Getenv("SMTP_USERNAME"), // メールアドレス
		SMTPPassword: os.Getenv("SMTP_PASSWORD"), // アプリパスワード
		FromEmail:    os.Getenv("FROM_EMAIL"),
		FromName:     os.Getenv("FROM_NAME"),
	}
}

// SendPasswordResetEmail - パスワードリセットメールを送信
func SendPasswordResetEmail(toEmail, username, resetURL string) error {
	config := GetEmailConfig()

	// メール設定チェック
	if config.SMTPHost == "" || config.SMTPPort == "" {
		return fmt.Errorf("SMTP設定が不完全です")
	}

	// メール本文
	subject := "パスワードリセットのご案内"
	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9fafb; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
        }
        .footer { 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
        }
        .warning { 
            background-color: #FEF2F2; 
            border-left: 4px solid #EF4444; 
            padding: 12px; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>パスワードリセット</h1>
        </div>
        <div class="content">
            <p>こんにちは、<strong>%s</strong>さん</p>
            <p>パスワードリセットのリクエストを受け付けました。</p>
            <p>以下のボタンをクリックして、新しいパスワードを設定してください。</p>
            
            <p style="text-align: center;">
                <a href="%s" class="button">パスワードをリセット</a>
            </p>
            
            <p>または、以下のURLをブラウザにコピー＆ペーストしてください：</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 5px;">
                %s
            </p>
            
            <div class="warning">
                <strong>⚠️ 重要な注意事項</strong>
                <ul>
                    <li>このリンクの有効期限は<strong>1時間</strong>です</li>
                    <li>リンクは<strong>1回のみ</strong>使用可能です</li>
                    <li>このリクエストに心当たりがない場合は、このメールを無視してください</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>このメールに心当たりがない場合は、第三者がメールアドレスを誤って入力した可能性があります。</p>
            <p>© 2026 ブログアプリ All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`, username, resetURL, resetURL)

	// メールヘッダー
	message := fmt.Sprintf(
		"From: %s <%s>\r\n"+
			"To: %s\r\n"+
			"Subject: %s\r\n"+
			"MIME-Version: 1.0\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"%s",
		config.FromName,
		config.FromEmail,
		toEmail,
		subject,
		body,
	)

	// SMTP認証
	auth := smtp.PlainAuth(
		"",
		config.SMTPUsername,
		config.SMTPPassword,
		config.SMTPHost,
	)

	// メール送信
	err := smtp.SendMail(
		config.SMTPHost+":"+config.SMTPPort,
		auth,
		config.FromEmail,
		[]string{toEmail},
		[]byte(message),
	)

	if err != nil {
		return fmt.Errorf("メール送信失敗: %v", err)
	}

	return nil
}

// SendWelcomeEmail - ウェルカムメール送信（オプション）
func SendWelcomeEmail(toEmail, username string) error {
	config := GetEmailConfig()

	subject := "ご登録ありがとうございます"
	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ようこそ！</h1>
        </div>
        <div class="content">
            <p>こんにちは、<strong>%s</strong>さん</p>
            <p>ブログアプリへのご登録、ありがとうございます！</p>
            <p>これから素敵なブログライフをお楽しみください。</p>
        </div>
    </div>
</body>
</html>
`, username)

	message := fmt.Sprintf(
		"From: %s <%s>\r\n"+
			"To: %s\r\n"+
			"Subject: %s\r\n"+
			"MIME-Version: 1.0\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"%s",
		config.FromName,
		config.FromEmail,
		toEmail,
		subject,
		body,
	)

	auth := smtp.PlainAuth(
		"",
		config.SMTPUsername,
		config.SMTPPassword,
		config.SMTPHost,
	)

	return smtp.SendMail(
		config.SMTPHost+":"+config.SMTPPort,
		auth,
		config.FromEmail,
		[]string{toEmail},
		[]byte(message),
	)
}

/*
使用例:

1. Gmailを使う場合の .env 設定:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # アプリパスワードを生成
FROM_EMAIL=your-email@gmail.com
FROM_NAME=ブログアプリ

2. SendGridを使う場合:

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=ブログアプリ

3. handlers/password.go での使用:

import "blogapp/utils"

// ForgotPassword内で
err := utils.SendPasswordResetEmail(user.Email, user.Username, resetURL)
if err != nil {
    log.Printf("メール送信失敗: %v", err)
    // 本番環境ではエラーを隠蔽（セキュリティ対策）
}
*/
