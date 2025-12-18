package controllers

import (
	"net/http"

	"example/web-service-gin/initializers"
	"example/web-service-gin/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetAlbums responds with the list of all albums as JSON.
func GetAlbums(c *gin.Context) {
	var albums []models.Album
	if err := initializers.DB.Preload("User").Preload("Tags").Find(&albums).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, albums)
}

// GetAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func GetAlbumByID(c *gin.Context) {
	id := c.Param("id")

	var album models.Album
	if err := initializers.DB.Preload("User").Preload("Tags").First(&album, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, album)
}

// PostAlbums adds an album from JSON received in the request body.
func PostAlbums(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var albumInput struct {
		Title  string  `json:"title"`
		Artist string  `json:"artist"`
		Price  float64 `json:"price"`
		Cover  string  `json:"cover"`
		TagIDs []uint  `json:"tag_ids"`
	}

	if err := c.BindJSON(&albumInput); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDUint := userID.(uint)
	newAlbum := models.Album{
		Title:  albumInput.Title,
		Artist: albumInput.Artist,
		Price:  albumInput.Price,
		Cover:  albumInput.Cover,
		UserID: &userIDUint,
	}

	// Associate tags if provided
	if len(albumInput.TagIDs) > 0 {
		var tags []models.Tag
		if err := initializers.DB.Where("id IN ?", albumInput.TagIDs).Find(&tags).Error; err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error retrieving tags"})
			return
		}
		newAlbum.Tags = tags
	}

	if err := initializers.DB.Create(&newAlbum).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload with relations for the response
	initializers.DB.Preload("User").Preload("Tags").First(&newAlbum, newAlbum.ID)

	c.IndentedJSON(http.StatusCreated, newAlbum)
}

// UpdateAlbum updates an existing album
// Users can only update their own albums, admins can update any album
func UpdateAlbum(c *gin.Context) {
	id := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	userRole, _ := c.Get("role")

	var album models.Album
	if err := initializers.DB.First(&album, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Check authorization: user must own the album OR be an admin
	userIDUint := userID.(uint)
	if album.UserID != nil && *album.UserID != userIDUint && userRole != "admin" {
		c.IndentedJSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this album"})
		return
	}

	var albumInput struct {
		Title  string  `json:"title"`
		Artist string  `json:"artist"`
		Price  float64 `json:"price"`
		Cover  string  `json:"cover"`
		TagIDs []uint  `json:"tag_ids"`
	}

	if err := c.BindJSON(&albumInput); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update album fields
	album.Title = albumInput.Title
	album.Artist = albumInput.Artist
	album.Price = albumInput.Price
	album.Cover = albumInput.Cover

	// Update tags if provided
	if len(albumInput.TagIDs) > 0 {
		var tags []models.Tag
		if err := initializers.DB.Where("id IN ?", albumInput.TagIDs).Find(&tags).Error; err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error retrieving tags"})
			return
		}
		// Clear existing associations and set new ones
		initializers.DB.Model(&album).Association("Tags").Clear()
		album.Tags = tags
	}

	if err := initializers.DB.Save(&album).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload with relations for the response
	initializers.DB.Preload("User").Preload("Tags").First(&album, album.ID)

	c.IndentedJSON(http.StatusOK, album)
}

// DeleteAlbum deletes an album
// Users can only delete their own albums, admins can delete any album
func DeleteAlbum(c *gin.Context) {
	id := c.Param("id")
	userID, exists := c.Get("userID")
	if !exists {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	userRole, _ := c.Get("role")

	var album models.Album
	if err := initializers.DB.First(&album, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Check authorization: user must own the album OR be an admin
	userIDUint := userID.(uint)
	if album.UserID != nil && *album.UserID != userIDUint && userRole != "admin" {
		c.IndentedJSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this album"})
		return
	}

	// Delete the album (GORM will handle the many-to-many associations)
	if err := initializers.DB.Delete(&album).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Album deleted successfully"})
}
