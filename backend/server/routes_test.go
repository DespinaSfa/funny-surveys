package server

import (
	"backend/models"
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
	time.Sleep(3 * time.Second)
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

	token, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	log.Printf("Received token: %s", token)
}

// Get request end-to-end test
func TestGetAllPolls(t *testing.T) {

	log.Println("Test get all polls")

	token, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", "http://localhost:3001/polls", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Set the Authorization header
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status OK; got %v", resp.Status)
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}

	// Parse the response JSON into a slice of models.Poll
	var polls []models.Poll
	err = json.Unmarshal(body, &polls)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	// Example check: Ensure there is at least one poll in the response
	if len(polls) == 0 {
		t.Error("Expected at least one poll in response")
	}

	// Example check: Ensure each poll has the required fields
	for _, poll := range polls {
		if poll.ID == "" {
			t.Error("Poll missing 'id' field")
		}
		if poll.Title == "" {
			t.Error("Poll missing 'title' field")
		}
		if poll.Description == "" {
			t.Error("Poll missing 'description' field")
		}
		if poll.PollType == "" {
			t.Error("Poll missing 'pollType' field")
		}
	}

	log.Printf("Received polls: %v", polls)
}

// Post request end-to-end test
func TestPostNewPoll(t *testing.T) {

	log.Println("Test post new poll")

	token, err := AuthenticateUser("User1", "User1")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	// Create a new poll object
	newPoll := models.Poll{
		ID:          "2",
		Title:       "Sample Poll",
		Description: "This is a sample poll for testing purposes.",
		PollType:    "party",
	}

	// Convert poll object to JSON
	jsonPoll, err := json.Marshal(newPoll)
	if err != nil {
		t.Fatalf("Failed to marshal poll object: %v", err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", "http://localhost:3001/polls", bytes.NewBuffer(jsonPoll))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Set the Content-Type header
	req.Header.Set("Content-Type", "application/json")
	// Set the Authorization header
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status OK; got %v", resp.Status)
	}
}
