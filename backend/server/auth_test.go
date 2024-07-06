package server

import (
	"net/http/httptest"
	"testing"
)

func TestCreateToken(t *testing.T) {
	token, err := CreateToken(1)
	if err != nil {
		t.Errorf("Failed to create token: %v", err)
	}
	if token == "" {
		t.Error("Token is empty")
	}
}

func TestGetUserIdFromRefreshToken(t *testing.T) {
	token, _ := CreateRefreshToken(1)
	userID, err := GetUserIdFromRefreshToken(token)
	if err != nil {
		t.Errorf("Failed to get user ID from refresh token: %v", err)
	}
	if userID == nil || *userID != 1 {
		t.Error("User ID does not match expected value")
	}
}

func TestGetUserIdFromToken(t *testing.T) {
	token, _ := CreateToken(1)
	userID, err := GetUserIdFromToken(token)
	if err != nil {
		t.Errorf("Failed to get user ID from token: %v", err)
	}
	if userID == nil || *userID != 1 {
		t.Error("User ID does not match expected value")
	}
}

func TestGetUserId(t *testing.T) {
	token, _ := CreateToken(1)
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Add("Authorization", "Bearer "+token)

	userID, err := GetUserId(req)
	if err != nil {
		t.Errorf("Failed to get user ID from request: %v", err)
	}
	if userID == nil || *userID != 1 {
		t.Error("User ID does not match expected value")
	}
}

func TestGetUserIdInvalidHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Add("Authorization", "InvalidToken")

	_, err := GetUserId(req)
	if err == nil {
		t.Error("Expected error for invalid token, got none")
	}
}
