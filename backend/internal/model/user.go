package model

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UUID         uuid.UUID `json:"uuid"          db:"uuid"`
	Email        string    `json:"email"         db:"email"`
	PasswordHash string    `json:"-"             db:"password_hash"`
	CreatedAt    time.Time `json:"created_at"    db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"    db:"updated_at"`
}
