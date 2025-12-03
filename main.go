package main

import (
	"example/web-service-gin/controllers"
	"example/web-service-gin/initializers"
	"example/web-service-gin/middleware"
	"os"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	// CORS configuration to allow requests from the frontend
	router.Use(func(c *gin.Context) {
		allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
		if allowedOrigin == "" {
			allowedOrigin = "http://localhost:3000"
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

<<<<<<< HEAD
	// Public routes
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)

	// Routes protected by authentication
	protected := router.Group("/")
	protected.Use(middleware.RequireAuth())
=======
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)

	api := router.Group("/api")
	api.Use(middleware.Authenticate())
>>>>>>> 73d7158 (role-based authentication)
	{
		api.GET("/albums", controllers.GetAlbums)
		api.GET("/albums/:id", controllers.GetAlbumByID)
		api.POST("/albums", controllers.PostAlbums)
		api.GET("/profile", controllers.GetProfile)

<<<<<<< HEAD
		// Tag routes
		protected.GET("/tags", controllers.GetTags)
		protected.POST("/tags", controllers.CreateTag)
=======
		// Routes pour les tags
		api.GET("/tags", controllers.GetTags)
		api.POST("/tags", controllers.CreateTag)

		// Route protégée pour la création d'album
		api.POST("/albums", controllers.PostAlbums) // use existing handler (or implement controllers.CreateAlbum)// protected route

		// Pour les artistes uniquement
		artist := api.Group("/artist")
		artist.Use(middleware.RequireRole("artist"))
		{
			artist.POST("/albums/upload", controllers.PostAlbums)
		}
>>>>>>> 73d7158 (role-based authentication)
	}

	// serve built frontend if present (adjust path for your frontend build)
	if _, err := os.Stat("./frontend/dist/index.html"); err == nil {
		router.Static("/assets", "./frontend/dist/assets") // optional
		router.StaticFile("/", "./frontend/dist/index.html")
		router.NoRoute(func(c *gin.Context) { // SPA fallback
			c.File("./frontend/dist/index.html")
		})
	}

	// add a simple root/health endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "API running"})
	})

	// use PORT env or default 8082 and bind to all interfaces
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	router.Run(":" + port)
}
