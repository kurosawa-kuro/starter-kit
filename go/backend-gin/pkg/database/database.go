package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

func InitDB(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// SQLBoilerのデフォルトデータベースを設定
	boil.SetDB(db)

	return db, nil
}
