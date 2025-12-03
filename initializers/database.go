package initializers

import (
	"log"

	"example/web-service-gin/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("albums.db"), &gorm.Config{})
	if err != nil {
<<<<<<< HEAD
		log.Fatal("Unable to connect to database")
	}

=======
		log.Fatal("Unable to connect to the database")
	}

	// After DB is opened, ensure migrations include User
	if err := DB.AutoMigrate(&models.User{}, &models.Album{}, &models.Tag{}, &models.AlbumTag{}); err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}

>>>>>>> 73d7158 (role-based authentication)
	log.Println("Database connection successful")
}

func SyncDatabase() {
	err := DB.AutoMigrate(&models.Album{}, &models.User{}, &models.Tag{})
	if err != nil {
<<<<<<< HEAD
		log.Fatal("Error during database migration")
	}

	// Create a default user if it doesn't exist
=======
		log.Fatal("Error migrating the database")
	}

	// Create a default user if none exists
>>>>>>> 73d7158 (role-based authentication)
	var defaultUser models.User
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)

	if userCount == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
<<<<<<< HEAD
			log.Fatal("Error hashing default password")
=======
			log.Fatal("Error hashing the default password")
>>>>>>> 73d7158 (role-based authentication)
		}

		defaultUser = models.User{
			Email:    "admin@example.com",
			Password: string(hashedPassword),
			Name:     "Administrator",
		}

		if err := DB.Create(&defaultUser).Error; err != nil {
<<<<<<< HEAD
			log.Fatal("Error creating default user")
		}
		log.Println("Default user created: admin@example.com / admin123")
	} else {
		// Retrieve the first user as default user
		if err := DB.First(&defaultUser).Error; err != nil {
			log.Fatal("Error retrieving default user")
=======
			log.Fatal("Error creating the default user")
		}
		log.Println("Default user created: admin@example.com / admin123")
	} else {
		// Retrieve the first user as the default user
		if err := DB.First(&defaultUser).Error; err != nil {
			log.Fatal("Error retrieving the default user")
>>>>>>> 73d7158 (role-based authentication)
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
<<<<<<< HEAD
			log.Fatal("Error creating seed data")
		}
		log.Println("Seed data initialized with default user")
=======
			log.Fatal("Error creating seed data for albums")
		}
		log.Println("Seed data initialized with the default user")
>>>>>>> 73d7158 (role-based authentication)
	}
}

type registerBody struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func Register(c *gin.Context) {
	var body registerBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	// sanitize role: only allow 'artist' or default to 'user'
	role := "user"
	if body.Role == "artist" {
		role = "artist"
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "could not hash password"})
		return
	}

	user := models.User{
		Name:     body.Name,
		Email:    body.Email,
		Password: string(hashedPassword),
		Role:     role,
	}

	if err := DB.Create(&user).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "created"})
}
