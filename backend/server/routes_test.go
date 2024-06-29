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

// Authentication middleware helpoer function
func AuthenticateUser(username, password string) (string, string, error) {
	// Create the login credentials
	credentials := map[string]string{
		"username": username,
		"password": password,
	}

	// Convert credentials to JSON
	jsonCredentials, err := json.Marshal(credentials)
	if err != nil {
		return "", "", fmt.Errorf("failed to marshal credentials: %v", err)
	}

	// Send POST request to /login
	resp, err := http.Post("http://localhost:3001/login", "application/json", bytes.NewBuffer(jsonCredentials))
	if err != nil {
		return "", "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("expected status OK; got %v", resp.Status)
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", "", fmt.Errorf("failed to read response body: %v", err)
	}

	// Parse the response JSON
	var response map[string]string
	err = json.Unmarshal(body, &response)
	if err != nil {
		return "", "", fmt.Errorf("failed to parse response JSON: %v", err)
	}

	// Check if token is present in the response
	token, ok := response["token"]
	refreshToken, ok2 := response["refreshToken"]
	if !ok {
		return "", "", fmt.Errorf("token not found in response")
	}
	if token == "" {
		return "", "", fmt.Errorf("token is empty")
	}
	if refreshToken == "" {
		return "", "", fmt.Errorf("refreshToken is empty")
	}
	if !ok2 {
		return "", "", fmt.Errorf("refreshToken not found in response")
	}

	return token, refreshToken, nil
}

func TestAuthenticationMiddleware(t *testing.T) {
	log.Println("Test authentication middleware")

	token, _, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	log.Printf("Received token: %s", token)
}

func TestRefreshToken(t *testing.T) {
	log.Println("Test refresh token")

	// Simulate obtaining a refresh token from authentication
	_, refreshToken, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	// Prepare request body
	requestBody := map[string]string{
		"refreshToken": refreshToken,
	}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		t.Fatalf("Failed to marshal JSON data: %v", err)
	}

	// Create a new HTTP client
	client := &http.Client{}

	// Create a POST request to the refresh-token endpoint
	req, err := http.NewRequest("POST", "http://localhost:3001/refresh-token", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status OK; got %v", resp.Status)
	}

	// Read the response body
	var response map[string]string
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	// Verify the response contains token and refreshToken keys
	if _, ok := response["token"]; !ok {
		t.Error("Expected 'token' in response")
	}
	if _, ok := response["refreshToken"]; !ok {
		t.Error("Expected 'refreshToken' in response")
	}

	log.Println("Refresh token test successful")
}

// Get request end-to-end test
func TestGetAllPolls(t *testing.T) {

	log.Println("Test get all polls")

	token, _, err := AuthenticateUser("User2", "User2")
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

func PostNewPollAndGetID(token string, newPoll map[string]interface{}) (string, error) {
	// Convert poll object to JSON
	jsonPoll, err := json.Marshal(newPoll)
	if err != nil {
		return "", fmt.Errorf("failed to marshal poll object: %v", err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", "http://localhost:3001/polls", bytes.NewBuffer(jsonPoll))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	// Set the Content-Type header
	req.Header.Set("Content-Type", "application/json")
	// Set the Authorization header
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
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

	// Parse the response JSON to get the poll ID
	var response map[string]string
	err = json.Unmarshal(body, &response)
	if err != nil {
		return "", fmt.Errorf("failed to parse response JSON: %v", err)
	}

	// Check if pollID is present in the response
	pollID, ok := response["pollID"]
	if !ok {
		return "", fmt.Errorf("pollID not found in response")
	}
	if pollID == "" {
		return "", fmt.Errorf("pollID is empty")
	}

	return pollID, nil
}

// Post request end-to-end test
func TestPostNewPoll(t *testing.T) {

	log.Println("Test post new poll")

	token, _, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	// Create a new poll object (you can adjust the payload as needed)
	newPoll := map[string]interface{}{
		"userID":      2,
		"title":       "Sample Delete Poll",
		"description": "This is a sample poll for testing purposes.",
		"pollType":    "party",
	}
	// Send the POST request and get the poll ID
	pollID, err := PostNewPollAndGetID(token, newPoll)
	if err != nil {
		t.Fatalf("Failed to post new poll: %v", err)
	}

	log.Printf("Created poll with ID: %s", pollID)
}

// Delete request end-to-end test
func TestDeletePoll(t *testing.T) {
	token, _, err := AuthenticateUser("User2", "User2")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	newPoll := map[string]interface{}{
		"userID":      2,
		"title":       "Sample Delete Poll",
		"description": "This is a sample poll for testing purposes.",
		"pollType":    "party",
	}

	pollID, err := PostNewPollAndGetID(token, newPoll)
	if err != nil {
		t.Fatalf("Failed to post new poll: %v", err)
	}
	client := &http.Client{}
	req, err := http.NewRequest("DELETE", fmt.Sprintf("http://localhost:3001/polls/%s", pollID), nil)
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
		t.Fatalf("Expected status OK; got %v", resp.Status)
	}
}

// Put request end-to-end test
func TestUpdateUsername(t *testing.T) {

	log.Println("Test update username")

	token, _, err := AuthenticateUser("User1", "User1")
	if err != nil {
		t.Fatalf("Authentication failed: %v", err)
	}

	// Define the new username to update
	newUsername := "CoolName"

	// Prepare JSON payload
	updateData := map[string]string{
		"newUsername": newUsername,
	}
	jsonData, err := json.Marshal(updateData)
	if err != nil {
		t.Fatalf("Failed to marshal JSON data: %v", err)
	}

	// Create PUT request
	client := &http.Client{}
	req, err := http.NewRequest("PUT", "http://localhost:3001/update-username", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	// Send request
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status OK; got %v", resp.Status)
	}

	log.Printf("Username updated successfully to %s", newUsername)
}
