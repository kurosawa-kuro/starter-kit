package services

import (
	"backend/config"
	"backend/models"
	"backend/utils"
	"database/sql"
	"fmt"
)

// HelloWorldService はHello World関連のビジネスロジックを管理します
type HelloWorldService struct {
	db       *config.Database
	mockData *utils.MockData
}

// NewHelloWorldService は新しいHelloWorldServiceを作成します
func NewHelloWorldService(db *config.Database) *HelloWorldService {
	return &HelloWorldService{
		db:       db,
		mockData: utils.NewMockData(),
	}
}

// CreateHelloWorldMessage は新しいHello Worldメッセージを作成します
func (s *HelloWorldService) CreateHelloWorldMessage(name string) (*models.HelloWorldMessage, error) {
	// データベースが利用できない場合はモックレスポンスを返す
	if s.db == nil || s.db.DB == nil {
		return s.mockData.GetMockHelloWorldMessage(name), nil
	}

	query := `
		INSERT INTO hello_world_messages (name, message) 
		VALUES ($1, $2) 
		RETURNING id, name, message, created_at, updated_at
	`

	message := fmt.Sprintf("Hello, %s!", name)

	var msg models.HelloWorldMessage
	err := s.db.DB.QueryRow(query, name, message).Scan(
		&msg.ID,
		&msg.Name,
		&msg.Message,
		&msg.CreatedAt,
		&msg.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create hello world message: %w", err)
	}

	return &msg, nil
}

// GetHelloWorldMessages は全てのHello Worldメッセージを取得します
func (s *HelloWorldService) GetHelloWorldMessages() ([]models.HelloWorldMessage, error) {
	// データベースが利用できない場合はモックレスポンスを返す
	if s.db == nil || s.db.DB == nil {
		return s.mockData.GetMockHelloWorldMessages(), nil
	}

	query := `
		SELECT id, name, message, created_at, updated_at 
		FROM hello_world_messages 
		ORDER BY created_at DESC
	`

	rows, err := s.db.DB.Query(query)
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
		return nil, fmt.Errorf("error iterating over rows: %w", err)
	}

	return messages, nil
}

// GetHelloWorldMessageByID は指定されたIDのHello Worldメッセージを取得します
func (s *HelloWorldService) GetHelloWorldMessageByID(id int) (*models.HelloWorldMessage, error) {
	// データベースが利用できない場合はモックレスポンスを返す
	if s.db == nil || s.db.DB == nil {
		message := s.mockData.GetMockHelloWorldMessageByID(id)
		if message == nil {
			return nil, fmt.Errorf("hello world message not found with id: %d", id)
		}
		return message, nil
	}

	query := `
		SELECT id, name, message, created_at, updated_at 
		FROM hello_world_messages 
		WHERE id = $1
	`

	var msg models.HelloWorldMessage
	err := s.db.DB.QueryRow(query, id).Scan(
		&msg.ID,
		&msg.Name,
		&msg.Message,
		&msg.CreatedAt,
		&msg.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("hello world message not found with id: %d", id)
		}
		return nil, fmt.Errorf("failed to get hello world message: %w", err)
	}

	return &msg, nil
}
