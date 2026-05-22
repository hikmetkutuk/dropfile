package handler

import (
	"database/sql"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/hikmetkutuk/dropfile/backend/internal/dto"
	"golang.org/x/crypto/bcrypt"
)

type Auth struct {
	db        *sql.DB
	validate  *validator.Validate
	jwtSecret string
}

func NewAuth(db *sql.DB, v *validator.Validate, jwtSecret string) *Auth {
	return &Auth{db: db, validate: v, jwtSecret: jwtSecret}
}

func (a *Auth) Register(w http.ResponseWriter, r *http.Request) {
	var req dto.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := a.validate.Struct(req); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "validation failed: "+err.Error())
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		slog.Error("bcrypt failed", "error", err)
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	id := uuid.New()
	_, err = a.db.Exec(
		"INSERT INTO users (uuid, email, password_hash) VALUES ($1, $2, $3)",
		id, req.Email, string(hash),
	)
	if err != nil {
		slog.Error("insert user failed", "error", err)
		writeError(w, http.StatusConflict, "email already exists")
		return
	}

	resp := dto.RegisterResponse{UUID: id.String(), Email: req.Email}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func (a *Auth) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := a.validate.Struct(req); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "validation failed: "+err.Error())
		return
	}

	var user struct {
		UUID         string `db:"uuid"`
		PasswordHash string `db:"password_hash"`
	}
	err := a.db.QueryRow(
		"SELECT uuid, password_hash FROM users WHERE email = $1", req.Email,
	).Scan(&user.UUID, &user.PasswordHash)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		writeError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.UUID,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenStr, err := token.SignedString([]byte(a.jwtSecret))
	if err != nil {
		slog.Error("jwt sign failed", "error", err)
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	resp := dto.LoginResponse{Token: tokenStr}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func writeError(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
