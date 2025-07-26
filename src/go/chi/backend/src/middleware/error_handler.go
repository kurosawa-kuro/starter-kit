package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/models"
)

// ErrorHandler エラーハンドリングミドルウェア
func ErrorHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				// パニックが発生した場合の処理
				response := models.ErrorResponse{
					Status:    "error",
					Error:     "internal_error",
					Message:   "Internal Server Error",
					Timestamp: time.Now(),
				}

				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(response)
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// CORS クロスオリジンリソース共有ミドルウェア
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RequestLogger リクエストログミドルウェア
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// レスポンスをラップしてステータスコードを取得
		ww := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(ww, r)

		duration := time.Since(start)

		// ログ出力
		log.Printf("%s %s %d %v", r.Method, r.URL.Path, ww.statusCode, duration)
	})
}

// responseWriter レスポンスライターのラッパー
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

// WriteHeader ステータスコードを記録
func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
