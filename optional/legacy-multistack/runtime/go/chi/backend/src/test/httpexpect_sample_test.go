package test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	httpExpect "github.com/gavv/httpexpect/v2"
)

func TestHelloWorldAPI(t *testing.T) {
	// テスト用のHTTPサーバーを作成
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Hello, World!"}`))
	})
	srv := httptest.NewServer(handler)
	defer srv.Close()

	e := httpExpect.New(t, srv.URL)
	e.GET("/").
		Expect().
		Status(http.StatusOK).
		JSON().Object().
		ValueEqual("message", "Hello, World!")
}
