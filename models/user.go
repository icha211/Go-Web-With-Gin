package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Name     string `json:"name"`
<<<<<<< HEAD
	
	// One-to-many relation: A user can have multiple albums
=======
	Role     string `gorm:"default:user"` // <-- add this

	// Relation one-to-many: Un utilisateur peut avoir plusieurs albums
>>>>>>> 73d7158 (role-based authentication)
	Albums []Album `gorm:"foreignKey:UserID" json:"albums,omitempty"`
}
