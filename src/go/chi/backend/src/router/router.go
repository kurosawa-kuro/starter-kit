package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"

	"backend/handler"
	custommiddleware "backend/middleware"
)

// NewRouter 新しいルーターを作成
func NewRouter(healthHandler *handler.HealthHandler, helloWorldHandler *handler.HelloWorldHandler) http.Handler {
	r := chi.NewRouter()

	// ミドルウェア設定
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.NoCache)
	r.Use(chimiddleware.GetHead)
	r.Use(chimiddleware.Throttle(100))
	r.Use(chimiddleware.Timeout(60))

	// カスタムミドルウェア
	r.Use(custommiddleware.ErrorHandler)
	r.Use(custommiddleware.CORS)

	// ルートエンドポイント
	r.Get("/", helloWorldHandler.RootHandler)

	// APIグループ
	r.Route("/api", func(api chi.Router) {
		// ヘルスチェック
		api.Get("/health", healthHandler.HealthCheckHandler)

		// Hello World API
		api.Route("/hello-world", func(hello chi.Router) {
			hello.Get("/", helloWorldHandler.GetHelloWorldHandler)
			hello.Post("/", helloWorldHandler.CreateHelloWorldHandler)
			hello.Get("/messages", helloWorldHandler.GetHelloWorldMessagesHandler)
			hello.Get("/messages/{id}", helloWorldHandler.GetHelloWorldMessageByIDHandler)
		})
	})

	// Swagger UI
	r.Get("/swagger/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/swagger", http.FileServer(http.Dir("./docs"))).ServeHTTP(w, r)
	})

	return r
}
