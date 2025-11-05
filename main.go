package main

import (
	"example/web-service-gin/controllers"
	"example/web-service-gin/initializers"
	"example/web-service-gin/middleware"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	// Routes publiques
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)

	// Routes protégées par authentification
	protected := router.Group("/")
	protected.Use(middleware.RequireAuth())
	{
		protected.GET("/albums", controllers.GetAlbums)
		protected.GET("/albums/:id", controllers.GetAlbumByID)
		protected.POST("/albums", controllers.PostAlbums)
		protected.GET("/profile", controllers.GetProfile)
	}

	router.Run("localhost:8082")
}
