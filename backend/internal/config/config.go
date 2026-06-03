package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port        int
	DatabaseURL string
	JWTSecret   string
	CORSOrigin  string
	Timeout     time.Duration
}

func Load() (*Config, error) {
	portValue := getEnv("PORT", "8080")
	port, err := strconv.Atoi(portValue)
	if err != nil {
		return nil, fmt.Errorf("invalid PORT %q: %w", portValue, err)
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return nil, errors.New("JWT_SECRET is required")
	}

	return &Config{
		Port:        port,
		DatabaseURL: getEnv("DATABASE_URL", "postgres://localhost:5432/dropfile?sslmode=disable"),
		JWTSecret:   jwtSecret,
		CORSOrigin:  getEnv("CORS_ORIGIN", "http://localhost:3000"),
		Timeout:     30 * time.Second,
	}, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
