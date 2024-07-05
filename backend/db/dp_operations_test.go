package db

import (
	"backend/models"
	"encoding/json"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	var err error
	db, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.Poll{}, &models.User{}, &models.GenericPollResponse{})

	m.Run()
}

func beforeEach() {
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.Poll{})
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.User{})
	db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.GenericPollResponse{})
}

func TestCreatePoll(t *testing.T) {
	beforeEach()

	poll := models.Poll{Title: "Test Poll", Description: "This is a test poll", PollType: "general"}
	createdPoll, err := CreatePoll(db, &poll)
	if err != nil {
		t.Errorf("Failed to create poll: %v", err)
	} else if createdPoll.Title != poll.Title {
		t.Errorf("Expected title %s, got %s", poll.Title, createdPoll.Title)
	}
}

func TestReadPollByID(t *testing.T) {
	beforeEach()

	poll := models.Poll{Title: "Test Poll", Description: "This is a test poll", PollType: "general"}
	db.Create(&poll)

	retrievedPoll, err := ReadPollByID(db, poll.ID)
	if err != nil {
		t.Errorf("Failed to read poll by ID: %v", err)
	}

	if retrievedPoll.Title != poll.Title {
		t.Errorf("Expected title %s, got %s", poll.Title, retrievedPoll.Title)
	}
}

func TestDeletePollByID(t *testing.T) {
	beforeEach()

	poll := models.Poll{Title: "Test Poll", Description: "This is a test poll", PollType: "general"}
	db.Create(&poll)

	err := DeletePollByID(db, poll.ID)
	if err != nil {
		t.Errorf("Failed to delete poll by ID: %v", err)
	}

	var result models.Poll
	if err := db.First(&result, poll.ID).Error; err == nil {
		t.Errorf("Expected error when fetching deleted poll, got none")
	}
}

func TestCreatePollResponse(t *testing.T) {
	beforeEach()

	poll := models.Poll{Title: "Test Poll", Description: "This is a test poll", PollType: "general"}
	db.Create(&poll)

	response := models.GenericPollResponse{PollID: poll.ID, Data: json.RawMessage(`{"response": "Test Response"}`)}
	jsonResponse, _ := json.Marshal(response)

	err := CreatePollResponse(db, jsonResponse)
	if err != nil {
		t.Errorf("Failed to create poll response: %v", err)
	}
}

func TestReadUserStats(t *testing.T) {
	beforeEach()

	user := models.User{Username: "testuser", PasswordHash: hashPassword("password")}
	db.Create(&user)

	stats, err := ReadUserStats(db, int(user.ID))
	if err != nil {
		t.Errorf("Failed to read user stats: %v", err)
	} else if stats.TotalPolls != 0 {
		t.Errorf("Expected total polls to be 0, got %d", stats.TotalPolls)
	}

}
