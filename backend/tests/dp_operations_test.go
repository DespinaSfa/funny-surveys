package tests

import (
	"backend/config"
	"backend/db"
	"backend/models"
	"fmt"
	"gorm.io/gorm"
	"sync"
	"testing"
)

var wg sync.WaitGroup
var dbInstance *gorm.DB

func init() {
	/*	wg.Add(1)
		go func() {
			server.InitServer(true)
			defer wg.Done()
		}()
		time.Sleep(3 * time.Second)*/
	configPath := "./../.env"

	dbConfig := config.LoadConfig(configPath)

	var err error
	dbInstance, err = db.SetupDatabase(dbConfig)
	if err != nil {
		panic("error setting up database: " + err.Error())
	}

}

func TestCreatePoll(t *testing.T) {
	poll := &models.Poll{
		UserID:      uint(2),
		Title:       "Test Poll",
		Description: "This is a test poll",
		PollType:    "party",
	}
	pollsBefore, _ := db.ReadUserPolls(2)

	_, err := db.CreatePoll(dbInstance, poll)
	if err != nil {
		t.Errorf("Failed to create poll: %v", err)
	}

	pollsAfter, _ := db.ReadUserPolls(2)
	if err != nil {
		t.Errorf("Failed to create poll: %v", err)
	} else if len(pollsBefore) >= len(pollsAfter) {
		t.Errorf("Expected number of polls to be %d, got %d", len(pollsAfter)+1, len(pollsBefore))
	}
}

func TestReadPollByID(t *testing.T) {

	poll := &models.Poll{
		UserID:      uint(2),
		Title:       "Test Poll",
		Description: "This is a test poll",
		PollType:    "party",
	}

	createdPoll, err := db.CreatePoll(dbInstance, poll)

	retrievedPoll, err := db.ReadPollByID(dbInstance, createdPoll.ID)
	if err != nil {
		t.Errorf("Failed to read poll by ID: %v", err)
	}

	if retrievedPoll.Title != poll.Title {
		t.Errorf("Expected title %s, got %s", poll.Title, retrievedPoll.Title)
	}
}

func TestDeletePollByID(t *testing.T) {

	poll := &models.Poll{
		UserID:      uint(2),
		Title:       "Test Poll",
		Description: "This is a test poll",
		PollType:    "party",
	}
	pollCreated, err := db.CreatePoll(dbInstance, poll)
	pollsBefore, _ := db.ReadUserPolls(2)
	err = db.DeletePollByID(dbInstance, pollCreated.ID)
	if err != nil {
		t.Errorf("Failed to delete poll by ID: %v", err)
	}
	pollsAfter, _ := db.ReadUserPolls(2)

	if len(pollsBefore) != len(pollsAfter)+1 {
		t.Errorf("Expected number of polls to be %d, got %d", len(pollsAfter)+1, len(pollsBefore))
	}

	_, errGetPoll := db.ReadPollByID(dbInstance, pollCreated.ID)
	if errGetPoll == nil {
		t.Errorf("Expected error when fetching deleted poll, got none")
	}
}

func TestCreatePollResponse(t *testing.T) {

	poll := &models.Poll{
		UserID:      uint(2),
		Title:       "Test Poll",
		Description: "This is a test poll",
		PollType:    "party",
	}
	pollCreated, _ := db.CreatePoll(dbInstance, poll)

	partyJson := `{
		"poll_id": "` + fmt.Sprint(pollCreated.ID) + `",
		"poll_type": "party",
		"data": {
			"songToBePlayed": "Dancing Queen",
			"currentAlcoholLevel": 5,
			"preferredAlcoholLevel": 1,
			"favoriteActivity": "dancing",
			"wishSnack": "Chips"
		}
	}`
	statsBefore, _ := db.ReadUserStats(dbInstance, 2)
	err := db.CreatePollResponse(dbInstance, []byte(partyJson))
	if err != nil {
		t.Errorf("Failed to create poll response: %v", err)
	}

	statsAfter, _ := db.ReadUserStats(dbInstance, 2)

	if statsBefore.TotalPolls < statsAfter.TotalPolls {
		t.Errorf("Expected total polls to be %d, got %d", statsAfter.TotalPolls, statsBefore.TotalPolls)
	}
}

func TestReadUserStats(t *testing.T) {

	stats, err := db.ReadUserStats(dbInstance, int(2))
	if err != nil {
		t.Errorf("Failed to read user stats: %v", err)
	}

	if stats.TotalPolls != 3 || stats.TotalAnswers != 10 || stats.MostPopularPoll != "Freds Fette Fete" || stats.LeastPopularPoll != "Unsere Hochzeit" {
		t.Errorf("Expected other data, got %v", stats)
	}
}

func TestReadUserPolls(t *testing.T) {

	polls, err := db.ReadUserPolls(int(2))
	if len(polls) != 3 {
		t.Errorf("Expected 3 polls, got %d", len(polls))
	}
	if err != nil {
		t.Errorf("Failed to read user polls: %v", err)
	} else if len(polls) == 0 {
		t.Errorf("Expected at least one poll, got none")
	}

}

func TestGetUsernameByID(t *testing.T) {
	username, _ := db.GetUserByUsername("User2")
	if username.Username != "User2" {
		t.Errorf("Expected username to be User2, got %s", username.Username)
	}
}

func TestChangeUsername(t *testing.T) {
	usernameBefore, _ := db.GetUserByUsername("User2")

	_, err := db.UpdateUsername(2, "TestUpdateUsername")
	if err != nil {
		t.Errorf("Failed to change username: %v", err)
	}

	usernameAfter, _ := db.GetUserByUsername("TestUpdateUsername")

	if usernameBefore == usernameAfter {
		t.Errorf("Expected username to be %s, got %s", usernameAfter.Username, usernameBefore.Username)
	}
}
