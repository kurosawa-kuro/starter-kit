package repositories

import (
	"backend-gin/internal/models"
	"context"
	"database/sql"

	"github.com/volatiletech/sqlboiler/v4/boil"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindAll(ctx context.Context) (models.UserSlice, error) {
	return models.Users().All(ctx, r.db)
}

func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	return user.Insert(ctx, r.db, boil.Infer())
}
