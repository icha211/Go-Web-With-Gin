package controllers

import (
	"net/http"
	"os"
	"time"

	"example/web-service-gin/initializers"
	"example/web-service-gin/models"
	"example/web-service-gin/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"github.com/golang-jwt/jwt/v4"
)

type registerBody struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func Register(c *gin.Context) {
	var body registerBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

<<<<<<< HEAD
	var existingUser models.User
	if err := initializers.DB.Where("email = ?", body.Email).First(&existingUser).Error; err == nil {
		c.IndentedJSON(http.StatusConflict, gin.H{"error": "This email is already in use"})
		return
=======
	role := "user"
	if body.Role == "artist" {
		role = "artist"
>>>>>>> 73d7158 (role-based authentication)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
<<<<<<< HEAD
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
=======
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
>>>>>>> 73d7158 (role-based authentication)
		return
	}

	user := models.User{
		Name:     body.Name,
		Email:    body.Email,
		Password: string(hashedPassword),
		Role:     role,
	}

	if err := initializers.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

<<<<<<< HEAD
	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
		"token": token,
	})
=======
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
>>>>>>> 73d7158 (role-based authentication)
}

func Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	var user models.User
	if err := initializers.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
<<<<<<< HEAD
		if err == gorm.ErrRecordNotFound {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
=======
		c.JSON(401, gin.H{"error": "Incorrect email or password"})
>>>>>>> 73d7158 (role-based authentication)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
<<<<<<< HEAD
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
=======
		c.JSON(401, gin.H{"error": "Incorrect email or password"})
>>>>>>> 73d7158 (role-based authentication)
		return
	}

	// create JWT with role
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"email": user.Email,
		"role": user.Role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
<<<<<<< HEAD
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
=======
		c.JSON(500, gin.H{"error": "could not create token"})
>>>>>>> 73d7158 (role-based authentication)
		return
	}

	c.JSON(200, gin.H{
		"token": signed,
		"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role},
	})
}

func GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user models.User
	if err := initializers.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.IndentedJSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{
		"id":    user.ID,
		"email": user.Email,
		"name":  user.Name,
	})
}
