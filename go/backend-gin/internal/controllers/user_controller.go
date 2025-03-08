package controllers

import (
	"backend-gin/internal/models"
	"backend-gin/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/volatiletech/null/v8"
)

type UserController struct {
	service *services.UserService
}

type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewUserController(service *services.UserService) *UserController {
	return &UserController{service: service}
}

func (c *UserController) RegisterRoutes(r *gin.Engine) {
	users := r.Group("/users")
	{
		users.GET("", c.ListUsers)
		users.POST("", c.CreateUser)
	}
}

func (c *UserController) ListUsers(ctx *gin.Context) {
	users, err := c.service.GetAllUsers(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, users)
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var req CreateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := &models.User{
		Name: req.Name,
		Email: null.StringFromPtr(func() *string {
			if req.Email == "" {
				return nil
			}
			return &req.Email
		}()),
		Password: null.StringFromPtr(func() *string {
			if req.Password == "" {
				return nil
			}
			return &req.Password
		}()),
	}

	if err := c.service.CreateUser(ctx, user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, user)
}
