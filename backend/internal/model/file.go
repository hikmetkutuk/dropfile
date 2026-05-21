package model

import (
	"time"

	"github.com/google/uuid"
)

type File struct {
	UUID         uuid.UUID  `json:"uuid"          db:"uuid"`
	Name         string     `json:"name"          db:"name"`
	Path         string     `json:"path"          db:"path"`
	Size         int64      `json:"size"          db:"size"`
	Type         string     `json:"type"          db:"type"`
	ThumbnailURL string     `json:"thumbnail_url" db:"thumbnail_url"`
	UserID       uuid.UUID  `json:"user_id"       db:"user_id"`
	ParentID     *uuid.UUID `json:"parent_id"     db:"parent_id"`
	IsFolder     bool       `json:"is_folder"     db:"is_folder"`
	IsStarred    bool       `json:"is_starred"    db:"is_starred"`
	IsTrash      bool       `json:"is_trash"      db:"is_trash"`
	CreatedAt    time.Time  `json:"created_at"    db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"    db:"updated_at"`
}
