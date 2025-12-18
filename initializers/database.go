package initializers

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"os"

	"example/web-service-gin/models"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("albums.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database")
	}

	log.Println("Database connection successful")
}

func SyncDatabase() {
	err := DB.AutoMigrate(&models.Album{}, &models.User{}, &models.Tag{})
	if err != nil {
		log.Fatal("Error while migrating the database")
	}

	// Create a default admin user if none exists
	var defaultUser models.User
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)

	if userCount == 0 {
		// Use ADMIN_PASSWORD from env for default admin, else generate a secure random one
		adminPassword := os.Getenv("ADMIN_PASSWORD")
		if adminPassword == "" {
			adminPassword = generateRandomPassword(18)
			log.Println("No ADMIN_PASSWORD provided. Generated a temporary admin password (dev only):", adminPassword)
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Error hashing the default password")
		}

		defaultUser = models.User{
			Email:    "admin@example.com",
			Password: string(hashedPassword),
			Name:     "Administrator",
			Role:     "admin",
		}

		if err := DB.Create(&defaultUser).Error; err != nil {
			log.Fatal("Error creating the default user")
		}
		log.Println("Default admin created: admin@example.com (change this password immediately)")
	} else {
		// Retrieve the first user as the default user
		if err := DB.First(&defaultUser).Error; err != nil {
			log.Fatal("Error fetching the default user")
		}
	}

	// Update existing albums without UserID to associate them with the default user
	userID := defaultUser.ID
	DB.Model(&models.Album{}).Where("user_id IS NULL").Update("user_id", userID)

	// Create seed albums if they don't exist
	var count int64
	DB.Model(&models.Album{}).Count(&count)
	if count == 0 {
		seedAlbums := []models.Album{
			{Title: "Blue Train", Artist: "John Coltrane", Price: 56.99, UserID: &userID},
			{Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99, UserID: &userID},
			{Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99, UserID: &userID},
		}
		if err := DB.Create(&seedAlbums).Error; err != nil {
			log.Fatal("Error creating seed data")
		}
		log.Println("Seed data initialized with the default user")
	}
}

// generateRandomPassword creates a base64 string of n random bytes
func generateRandomPassword(n int) string {
	if n <= 0 {
		n = 16
	}
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		// fallback to a fixed length if random fails
		return "ChangeMeNow_" + base64.RawURLEncoding.EncodeToString([]byte("fallback-entropy"))
	}
	return base64.RawURLEncoding.EncodeToString(b)
}
