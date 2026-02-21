package configaccess

import (
	"context"
	"net/http"
	"testing"
)

func TestAuthenticate_MultipleAuthorizationCandidates(t *testing.T) {
	p := newProvider("config", []string{"valid-key"})

	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "http://localhost/v1/models", nil)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	// net/http may merge duplicate Authorization headers into a comma-separated value.
	req.Header.Set("Authorization", "Bearer invalid-key, Bearer valid-key")

	result, authErr := p.Authenticate(context.Background(), req)
	if authErr != nil {
		t.Fatalf("authenticate returned error: %v", authErr)
	}
	if result == nil {
		t.Fatalf("authenticate returned nil result")
	}
	if result.Principal != "valid-key" {
		t.Fatalf("unexpected principal: %q", result.Principal)
	}
}

func TestExtractBearerTokens(t *testing.T) {
	got := extractBearerTokens("Bearer a, Bearer b, Bearer a")
	if len(got) != 2 {
		t.Fatalf("expected 2 unique tokens, got %d: %#v", len(got), got)
	}
	if got[0] != "a" || got[1] != "b" {
		t.Fatalf("unexpected token order/content: %#v", got)
	}
}

func TestAuthenticate_MultipleAuthorizationHeaderLines(t *testing.T) {
	p := newProvider("config", []string{"valid-key"})

	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "http://localhost/v1/models", nil)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	req.Header.Add("Authorization", "Bearer invalid-key")
	req.Header.Add("Authorization", "Bearer valid-key")

	result, authErr := p.Authenticate(context.Background(), req)
	if authErr != nil {
		t.Fatalf("authenticate returned error: %v", authErr)
	}
	if result == nil || result.Principal != "valid-key" {
		t.Fatalf("expected valid-key principal, got %#v", result)
	}
}
