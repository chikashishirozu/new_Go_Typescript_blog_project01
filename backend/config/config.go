package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port           string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	DatabaseURL    string
	JWTSecret      string
	Environment    string
	AllowedOrigins string
}

func Load() *Config {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "bloguser")
	dbPassword := getEnv("DB_PASSWORD", "blogpass")
	dbName := getEnv("DB_NAME", "blogapp")
	
	// DatabaseURL を構築
	databaseURL := getEnv("DATABASE_URL", fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort,
	))
	
	return &Config{
		Port:           getEnv("PORT", "8080"),
		DBHost:         dbHost,
		DBPort:         dbPort,
		DBUser:         dbUser,
		DBPassword:     dbPassword,
		DBName:         dbName,
		DatabaseURL:    databaseURL,
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key-change-this"),
		Environment:    getEnv("ENVIRONMENT", "development"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
	}
}

// LoadConfig は Load のエイリアス（後方互換性のため）
func LoadConfig() *Config {
	return Load()
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
