package services

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"backend/models"
)

// HelloWorldService Hello Worldサービス構造体
type HelloWorldService struct {
	db *sql.DB
}

// NewHelloWorldService Hello Worldサービスを新規作成
func NewHelloWorldService(db *sql.DB) *HelloWorldService {
	return &HelloWorldService{db: db}
}

// GetHelloWorld Hello Worldメッセージを取得
func (s *HelloWorldService) GetHelloWorld() *models.HelloWorldResponse {
	return &models.HelloWorldResponse{
		Message:   "Hello, World!",
		Timestamp: time.Now(),
		Version:   "1.0.0",
	}
}

// CreateHelloWorld Hello Worldメッセージを作成
func (s *HelloWorldService) CreateHelloWorld(request *models.HelloWorldRequest) (*models.HelloWorldMessage, error) {
	// バリデーション
	if err := request.Validate(); err != nil {
		return nil, err
	}

	if s.db == nil {
		return nil, errors.New("database connection is not available")
	}

	// データベースに保存
	query := `
		INSERT INTO hello_world_messages (name, message, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, message, created_at, updated_at
	`

	message := fmt.Sprintf("Hello, %s!", request.Name)
	now := time.Now()

	var result models.HelloWorldMessage
	err := s.db.QueryRow(
		query,
		request.Name,
		message,
		now,
		now,
	).Scan(
		&result.ID,
		&result.Name,
		&result.Message,
		&result.CreatedAt,
		&result.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create hello world message: %w", err)
	}

	return &result, nil
}

// GetHelloWorldMessages 全てのHello Worldメッセージを取得
func (s *HelloWorldService) GetHelloWorldMessages() ([]models.HelloWorldMessage, error) {
	if s.db == nil {
		return nil, errors.New("database connection is not available")
	}

	query := `
		SELECT id, name, message, created_at, updated_at
		FROM hello_world_messages
		ORDER BY created_at DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query hello world messages: %w", err)
	}
	defer rows.Close()

	var messages []models.HelloWorldMessage
	for rows.Next() {
		var msg models.HelloWorldMessage
		err := rows.Scan(
			&msg.ID,
			&msg.Name,
			&msg.Message,
			&msg.CreatedAt,
			&msg.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan hello world message: %w", err)
		}
		messages = append(messages, msg)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating hello world messages: %w", err)
	}

	return messages, nil
}

// GetHelloWorldMessageByID IDでHello Worldメッセージを取得
func (s *HelloWorldService) GetHelloWorldMessageByID(id int) (*models.HelloWorldMessage, error) {
	if s.db == nil {
		return nil, errors.New("database connection is not available")
	}

	query := `
		SELECT id, name, message, created_at, updated_at
		FROM hello_world_messages
		WHERE id = $1
	`

	var msg models.HelloWorldMessage
	err := s.db.QueryRow(query, id).Scan(
		&msg.ID,
		&msg.Name,
		&msg.Message,
		&msg.CreatedAt,
		&msg.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("hello world message not found")
		}
		return nil, fmt.Errorf("failed to get hello world message: %w", err)
	}

	return &msg, nil
}
