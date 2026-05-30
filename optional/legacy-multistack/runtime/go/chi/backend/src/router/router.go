package router

import (
	"net/http"
	"strings"

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
		// Swagger UIのHTMLを直接返す
		if strings.HasSuffix(r.URL.Path, "/swagger/") || strings.HasSuffix(r.URL.Path, "/swagger") {
			http.Redirect(w, r, "/swagger/index.html", http.StatusMovedPermanently)
			return
		}
		
		if strings.HasSuffix(r.URL.Path, "/swagger/index.html") {
			w.Header().Set("Content-Type", "text/html")
			w.Write([]byte(swaggerHTML))
			return
		}
		
		if strings.HasSuffix(r.URL.Path, "/swagger/swagger.json") {
			w.Header().Set("Content-Type", "application/json")
			http.ServeFile(w, r, "./docs/swagger.json")
			return
		}
		
		http.NotFound(w, r)
	})

	return r
}

// Swagger UI HTML
const swaggerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/swagger/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`
