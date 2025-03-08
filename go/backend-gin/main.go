package main

import (
	"backend-gin/models"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

func main() {
	// データベース接続
	db, err := sql.Open("sqlite3", "db/app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// SQLBoilerのデフォルトデータベースを設定
	boil.SetDB(db)

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello Gin with Go 1.22!",
		})
	})

	// ユーザー関連のエンドポイント
	r.GET("/users", func(c *gin.Context) {
		users, err := models.Users().All(c, db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, users)
	})

	r.POST("/users", func(c *gin.Context) {
		var user models.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := user.Insert(c, db, boil.Infer()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, user)
	})

	r.Run(":8080")
}
