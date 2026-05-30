package test

import (
	"net/http"
	"testing"

	"github.com/steinfletcher/apitest"
)

func TestHelloWorldOpenAPI(t *testing.T) {
	apitest.New().
		HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"message":"Hello, World!"}`))
		}).
		Get("/").
		Expect(t).
		Status(http.StatusOK).
		Body(`{"message":"Hello, World!"}`).
		End()
}
