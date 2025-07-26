package middleware

import (
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorHandler はグローバルエラーハンドリングミドルウェアです
func ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			errorResponse := models.NewErrorResponse(utils.StatusError, "internal_error", err)
			c.JSON(http.StatusInternalServerError, errorResponse)
		} else {
			errorResponse := models.NewErrorResponse(utils.StatusError, "internal_error", utils.ErrInternalServer)
			c.JSON(http.StatusInternalServerError, errorResponse)
		}
		c.Abort()
	})
}

// ValidationErrorHandler はバリデーションエラーを処理するミドルウェアです
func ValidationErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// バリデーションエラーの処理
		if len(c.Errors) > 0 {
			for _, err := range c.Errors {
				if err.Type == gin.ErrorTypeBind {
					errorResponse := models.NewErrorResponse(utils.StatusError, "validation_error", utils.ErrValidationFailed)
					c.JSON(http.StatusBadRequest, errorResponse)
					return
				}
			}
		}
	}
} 