package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"testing"
	"time"
)

var wg sync.WaitGroup

func init() {
	wg.Add(1)
	go func() {
		InitServer(true)
		defer wg.Done()
	}()
	// Give some time for the server to start
	time.Sleep(2 * time.Second)
}

func TestExampleRoute(t *testing.T) {
	// Start the server in testing mode
	log.Println("Test example route")
}

func AuthenticateUser(username, password string) (string, error) {
	// Create the login credentials
	credentials := map[string]string{
		"username": username,
		"password": password,
	}

	// Convert credentials to JSON
	jsonCredentials, err := json.Marshal(credentials)
	if err != nil {
		return "", fmt.Errorf("failed to marshal credentials: %v", err)
	}

	// Send POST request to /login
	resp, err := http.Post("http://localhost:3001/login", "application/json", bytes.NewBuffer(jsonCredentials))
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("expected status OK; got %v", resp.Status)
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %v", err)
	}

	// Parse the response JSON
	var response map[string]string
	err = json.Unmarshal(body, &response)
	if err != nil {
		return "", fmt.Errorf("failed to parse response JSON: %v", err)
	}

	// Check if token is present in the response
	token, ok := response["token"]
	if !ok {
		return "", fmt.Errorf("token not found in response")
	}
	if token == "" {
		return "", fmt.Errorf("token is empty")
	}

	return token, nil
}

func TestAuthenticationMiddleware(t *testing.T) {
	log.Println("Test authentication middleware")

	token, err := AuthenticateUser("User1", "User1")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	log.Printf("Received token: %s", token)
}
