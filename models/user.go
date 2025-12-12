package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Name     string `json:"name"`
	Role     string `gorm:"default:user" json:"role"` // Add this line

	// One-to-many relation: A user can have multiple albums
	Albums []Album `gorm:"foreignKey:UserID" json:"albums,omitempty"`
}
