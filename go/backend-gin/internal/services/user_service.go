package services

import (
	"backend-gin/internal/models"
	"backend-gin/internal/repositories"
	"context"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetAllUsers(ctx context.Context) (models.UserSlice, error) {
	return s.repo.FindAll(ctx)
}

func (s *UserService) CreateUser(ctx context.Context, user *models.User) error {
	return s.repo.Create(ctx, user)
}
