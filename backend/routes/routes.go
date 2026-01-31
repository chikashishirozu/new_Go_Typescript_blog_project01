package routes

import (
	"blogapp/handlers"
	"blogapp/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// CORS middleware
	router.Use(middleware.CORSMiddleware())

	// Public routes
	api := router.Group("/api")
	{
		// Auth routes
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)

		// Public post routes
		api.GET("/posts", handlers.GetPosts)
		api.GET("/posts/:id", handlers.GetPost)
		api.GET("/posts/slug/:slug", handlers.GetPostBySlug)

		// Categories
		api.GET("/categories", handlers.GetCategories)
		api.GET("/categories/:id", handlers.GetCategory)

		// Tags
		api.GET("/tags", handlers.GetTags)
		api.GET("/tags/:id", handlers.GetTag)

		// Comments
		api.GET("/posts/:id/comments", handlers.GetComments)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Posts
		protected.POST("/posts", handlers.CreatePost)
		protected.PUT("/posts/:id", handlers.UpdatePost)
		protected.DELETE("/posts/:id", handlers.DeletePost)

		// Categories
		protected.POST("/categories", handlers.CreateCategory)
		protected.PUT("/categories/:id", handlers.UpdateCategory)
		protected.DELETE("/categories/:id", handlers.DeleteCategory)

		// Tags
		protected.POST("/tags", handlers.CreateTag)
		protected.PUT("/tags/:id", handlers.UpdateTag)
		protected.DELETE("/tags/:id", handlers.DeleteTag)

		// Comments
		protected.POST("/posts/:id/comments", handlers.CreateComment)
		protected.PUT("/comments/:id", handlers.UpdateComment)
		protected.DELETE("/comments/:id", handlers.DeleteComment)

		// Upload
		protected.POST("/upload", handlers.UploadFile)
	}
}
