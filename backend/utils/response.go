package utils

import (
// 	"net/http"

	"github.com/labstack/echo/v4"
)

func SuccessResponse(c echo.Context, code int, data interface{}) error {
	return c.JSON(code, echo.Map{
		"success": true,
		"data": data,
	})
}

func ErrorResponse(c echo.Context, status int, message string) error {
	return c.JSON(status, map[string]interface{}{
		"success": false,
		"message": message,
	})
}

