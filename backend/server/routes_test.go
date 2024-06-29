package server

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"
	"testing"
)

var wg sync.WaitGroup

func init() {
	wg.Add(1)
	go func() {
		InitServer(true)
		defer wg.Done()
	}()
}

func TestExampleRoute(t *testing.T) {
	// Start the server in testing mode
	log.Println("Test example route")
}

func TestAuthenticationMiddleware(t *testing.T) {
	log.Println("Test authentication middleware")

	// Create the login credentials
	credentials := map[string]string{
		"username": "User1",
		"password": "User1",
	}

	// Convert credentials to JSON
	jsonCredentials, err := json.Marshal(credentials)
	if err != nil {
		t.Fatalf("Failed to marshal credentials: %v", err)
	}

	// Send POST request to /login
	resp, err := http.Post("http://localhost:3001/login", "application/json", bytes.NewBuffer(jsonCredentials))
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			t.Fatalf("Failed to close response body: %v", err)
		}
	}(resp.Body)

	// Check status code
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status OK; got %v", resp.Status)
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}

	// Parse the response JSON
	var response map[string]string
	err = json.Unmarshal(body, &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	// Check if token is present in the response
	token, ok := response["token"]
	if !ok {
		t.Error("Token not found in response")
	}
	if token == "" {
		t.Error("Token is empty")
	}

	log.Printf("Received token: %s", token)
}
