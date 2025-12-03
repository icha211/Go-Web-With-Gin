package middleware

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func RequireRole(required string) gin.HandlerFunc {
    return func(c *gin.Context) {
        roleVal, exists := c.Get("role")
        if !exists {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
            return
        }
        role := roleVal.(string)
        if role != required && role != "admin" {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
            return
        }
        c.Next()
    }
}