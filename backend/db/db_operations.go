package db

import (
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreatePoll(db *gorm.DB, addPoll *models.Poll) (*models.Poll, error) {
	result := db.Create(addPoll)
	if result.Error != nil {
		return nil, fmt.Errorf("error creating poll: %w", result.Error)
	}
	return addPoll, nil
}

func CreatePollResponse(db *gorm.DB, jsonResponse []byte) error {

	//example usage:
	//partyJson := `{
	//    "poll_id": 1,
	//    "poll_type": "party",
	//    "data": {
	//        "songToBePlayed": "Dancing Queen",
	//        "currentAlcoholLevel": 5,
	//        "preferredAlcoholLevel": 7,
	//        "favoriteActivity": "Karaoke",
	//        "wishSnack": "Chips"
	//    }
	//}`
	//if err := db.AddPollResponse(dataBase, []byte(partyJson)); err != nil {
	//	fmt.Println("Error adding party poll response:", err)
	//} else {
	//	fmt.Println("Party poll response added successfully")
	//}

	var response models.GenericPollResponse
	if err := json.Unmarshal(jsonResponse, &response); err != nil {
		return err
	}

	// Check if the poll ID exists
	var poll models.Poll
	if err := db.First(&poll, "id = ?", response.PollID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("poll with ID %s not found: %w", response.PollID, err)
		}
		return fmt.Errorf("error checking poll existence: %w", err)
	}

	switch response.PollType {
	case "party":
		var partyResponse models.PollPartyResponse
		if err := json.Unmarshal(response.Data, &partyResponse); err != nil {
			return err
		}
		// Convert PollPartyResponse to PollParty (your DBInst model)
		dbModel := models.PollParty{
			PollID:                response.PollID,
			SongToBePlayed:        partyResponse.SongToBePlayed,
			CurrentAlcoholLevel:   partyResponse.CurrentAlcoholLevel,
			PreferredAlcoholLevel: partyResponse.PreferredAlcoholLevel,
			FavoriteActivity:      partyResponse.FavoriteActivity,
			WishSnack:             partyResponse.WishSnack,
		}

		if dbModel.CurrentAlcoholLevel < 0 || dbModel.CurrentAlcoholLevel > 5 {
			return errors.New("current alcohol level must be between 0 and 5")
		}
		if dbModel.PreferredAlcoholLevel < 0 || dbModel.PreferredAlcoholLevel > 5 {
			return errors.New("preferred alcohol level must be between 0 and 5")
		}

		if dbModel.FavoriteActivity != "dancing" &&
			dbModel.FavoriteActivity != "drinking" &&
			dbModel.FavoriteActivity != "eating" &&
			dbModel.FavoriteActivity != "singing" &&
			dbModel.FavoriteActivity != "beerpong" {
			return errors.New("favorite activity must be one of: dancing, drinking, eating, singing, beerpong")
		}

		return db.Create(&dbModel).Error

	case "wedding":
		var weddingResponse models.PollWeddingResponse
		if err := json.Unmarshal(response.Data, &weddingResponse); err != nil {
			return err
		}

		// Convert PollWeddingResponse to PollWedding (your DBInst model)
		dbModel := models.PollWedding{
			PollID:              response.PollID,
			WeddingInvite:       weddingResponse.WeddingInvite,
			KnowCoupleSince:     weddingResponse.KnowCoupleSince,
			KnowCoupleFromWhere: weddingResponse.KnowCoupleFromWhere,
			WeddingHighlight:    weddingResponse.WeddingHighlight,
			CoupleWish:          weddingResponse.CoupleWish,
		}

		// Check wedding invite
		if dbModel.WeddingInvite != "bride" && dbModel.WeddingInvite != "groom" && dbModel.WeddingInvite != "both" {
			return errors.New("wedding invite must be one of: bride, groom, both")
		}

		// Check acquaintance duration
		if dbModel.KnowCoupleSince < 1 || dbModel.KnowCoupleSince > 30 {
			return errors.New("know couple since must be between 1 and 30 years")
		}

		// Wedding highlight check
		validHighlights := map[string]bool{"wedding": true, "food": true, "dance": true, "program": true, "afterParty": true}
		if _, ok := validHighlights[dbModel.WeddingHighlight]; !ok {
			return errors.New("wedding highlight must be one of: wedding, food, dance, program, afterParty")
		}

		// Create record in the database
		return db.Create(&dbModel).Error

	case "planning":
		var planningResponse models.PollPlanningResponse
		if err := json.Unmarshal(response.Data, &planningResponse); err != nil {
			return err
		}

		// Convert PollPlanningResponse to PollPlanning
		dbModel := models.PollPlanning{
			PollID:          response.PollID,
			EssentialDrink:  planningResponse.EssentialDrink,
			EssentialFood:   planningResponse.EssentialFood,
			MusicToBePlayed: planningResponse.MusicToBePlayed,
			Activities:      planningResponse.Activities,
			EventWish:       planningResponse.EventWish,
		}

		// Validate MusicToBePlayed
		validMusicTypes := map[string]bool{
			"pop": true, "rock": true, "rap": true, "edm": true, "indie": true,
		}
		if !validMusicTypes[dbModel.MusicToBePlayed] {
			return fmt.Errorf("invalid music type: %s", dbModel.MusicToBePlayed)
		}

		// Validate Activities
		validActivities := map[string]bool{
			"theme": true, "photobooth": true, "beerpong": true, "karaoke": true,
		}
		if !validActivities[dbModel.Activities] {
			return fmt.Errorf("invalid activity type: %s", dbModel.Activities)
		}

		// Optionally, validate non-empty string inputs
		if dbModel.EssentialDrink == "" {
			return fmt.Errorf("essential drink must not be empty")
		}
		if dbModel.EssentialFood == "" {
			return fmt.Errorf("essential food must not be empty")
		}
		if dbModel.EventWish == "" {
			return fmt.Errorf("event wish must not be empty")
		}

		// Create record in the database
		return db.Create(&dbModel).Error

	default:
		return errors.New("unknown poll type")
	}
}

func GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return &models.User{}, nil
		}
		return nil, fmt.Errorf("error querying database: %w", result.Error)
	}
	return &user, nil
}
func UpdateUsername(userID int, newUsername string) (*models.User, error) {
	var user models.User
	result := db.First(&user, userID)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find user: %w", result.Error)
	}

	user.Username = newUsername
	result = db.Save(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update username: %w", result.Error)
	}

	return &user, nil
}

func ReadUserPolls(userID int) ([]*models.PollInfo, error) {
	var user *models.User
	// Check if the user exists
	result := db.First(&user, userID)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find user: %w", result.Error)
	}

	var pollResponse []*models.PollInfo
	// Select only the "title" and "description" columns from the database
	result = db.Model(&models.Poll{}).Select("title, description, poll_type, id").Where("user_id = ?", userID).Scan(&pollResponse)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to get user's polls: %w", result.Error)
	}

	return pollResponse, nil
}

func ReadPollByID(db *gorm.DB, pollID string) (*models.Poll, error) {
	var poll models.Poll
	result := db.Preload("PollParties").Preload("PollWeddings").Preload("PollPlannings").First(&poll, "id = ?", pollID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("poll not found: %w", result.Error)
		}
		return nil, fmt.Errorf("error retrieving poll: %w", result.Error)
	}
	return &poll, nil
}

func ReadUserStats(db *gorm.DB, userID int) (*models.UserStats, error) {
	// Count total polls created by the user
	var totalPolls int64
	if err := db.Model(&models.Poll{}).Where("user_id = ?", userID).Count(&totalPolls).Error; err != nil {
		return nil, err
	}

	// Count total answers across PollParty, PollWedding, and PollPlanning
	var totalAnswers int64
	var pollPartyCount int64
	var pollWeddingCount int64
	var pollPlanningCount int64

	if err := db.Model(&models.PollParty{}).
		Joins("JOIN polls ON poll_parties.poll_id = polls.id").
		Where("polls.user_id = ?", userID).Count(&pollPartyCount).Error; err != nil {
		return nil, err
	}
	totalAnswers += pollPartyCount

	if err := db.Model(&models.PollWedding{}).
		Joins("JOIN polls ON poll_weddings.poll_id = polls.id").
		Where("polls.user_id = ?", userID).Count(&pollWeddingCount).Error; err != nil {
		return nil, err
	}
	totalAnswers += pollWeddingCount

	if err := db.Model(&models.PollPlanning{}).
		Joins("JOIN polls ON poll_plannings.poll_id = polls.id").
		Where("polls.user_id = ?", userID).Count(&pollPlanningCount).Error; err != nil {
		return nil, err
	}
	totalAnswers += pollPlanningCount

	// Read the most and least popular poll
	var mostPopularPoll models.Poll
	var leastPopularPoll models.Poll
	if err := db.Model(&models.Poll{}).
		Select("polls.*, (SELECT COUNT(*) FROM poll_parties WHERE poll_parties.poll_id = polls.id) + (SELECT COUNT(*) FROM poll_weddings WHERE poll_weddings.poll_id = polls.id) + (SELECT COUNT(*) FROM poll_plannings WHERE poll_plannings.poll_id = polls.id) AS answer_count").
		Where("polls.user_id = ?", userID).
		Order("answer_count DESC").
		First(&mostPopularPoll).Error; err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	if err := db.Model(&models.Poll{}).
		Select("polls.*, (SELECT COUNT(*) FROM poll_parties WHERE poll_parties.poll_id = polls.id) + (SELECT COUNT(*) FROM poll_weddings WHERE poll_weddings.poll_id = polls.id) + (SELECT COUNT(*) FROM poll_plannings WHERE poll_plannings.poll_id = polls.id) AS answer_count").
		Where("polls.user_id = ?", userID).
		Order("answer_count ASC").
		First(&leastPopularPoll).Error; err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	stats := models.UserStats{
		TotalPolls:       int(totalPolls),
		TotalAnswers:     int(totalAnswers),
		MostPopularPoll:  mostPopularPoll.Title,
		LeastPopularPoll: leastPopularPoll.Title,
	}

	return &stats, nil
}

func DeletePollByID(db *gorm.DB, pollID string) error {
	// Delete the poll; associated PollParty and PollWedding records will be deleted automatically
	result := db.Delete(&models.Poll{}, "id = ?", pollID)
	if result.Error != nil {
		return fmt.Errorf("failed to delete poll: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("no poll found with ID %s", pollID)
	}

	return nil
}

func populateDatabase(db *gorm.DB) {
	// Drop all tables
	if err := db.Migrator().DropTable(&models.User{}, &models.Poll{}, &models.PollParty{}, &models.PollWedding{}, &models.PollPlanning{}); err != nil {
		fmt.Printf("Failed to drop tables: %v\n", err)
		return
	}

	/*
	   // Check if the database is empty by checking for existing users
	   var countUsers int64
	   db.Model(&models.User{}).Count(&countUsers)
	   if countUsers > 0 {
	       fmt.Println("Database is not empty, skipping population.")
	       return
	   }
	*/

	// Automatically migrate your schema
	migrate := []interface{}{&models.User{}, &models.Poll{}, &models.PollParty{}, &models.PollWedding{}, &models.PollPlanning{}}
	for _, model := range migrate {
		if err := db.AutoMigrate(model); err != nil {
			fmt.Printf("Failed to migrate %T: %v\n", model, err)
			return
		}
	}

	// Populate users
	users := []models.User{
		{Username: "User1", PasswordHash: hashPassword("User1")},
		{Username: "User2", PasswordHash: hashPassword("User2")},
	}

	for i := range users {
		if err := db.Create(&users[i]).Error; err != nil {
			fmt.Printf("Failed to create user %s: %v\n", users[i].Username, err)
			return
		}
	}

	// Create polls
	polls := []models.Poll{
		{UserID: users[1].ID, Title: "Unsere Hochzeit", Description: "Hallo. Wir hoffen euch gefällt unsere Hochzeit. Für ein Spiel später füllt bitte diese kleine Umfrage aus. Vielen Dank! Euer Simon und eure Anna", PollType: "wedding"},
		{UserID: users[1].ID, Title: "Freds Fette Fete", Description: "Moin, moin! Diese Umfrage habe ich erstellt, damit ihr meine Party bewerten könnt. Die nächste wird dadurch noch geiler, versprochen!", PollType: "party"},
		{UserID: users[1].ID, Title: "Beste Wg Party", Description: "Hi! Zum Planen unserer nächsten WG Party brauchen wir eure Unterstützung.", PollType: "planning"},
	}

	for i := range polls {
		if err := db.Create(&polls[i]).Error; err != nil {
			fmt.Printf("Failed to create poll %s: %v\n", polls[i].Title, err)
			return
		}
	}

	// Create related results
	partyResults := []models.PollParty{
		{PollID: polls[1].ID, SongToBePlayed: "tempo - cro", CurrentAlcoholLevel: 1, PreferredAlcoholLevel: 3, FavoriteActivity: "dance", WishSnack: "Pizza"},
		{PollID: polls[1].ID, SongToBePlayed: "Friesenjung - Ski Aggu", CurrentAlcoholLevel: 5, PreferredAlcoholLevel: 1, FavoriteActivity: "karaoke", WishSnack: "Brownies"},
		{PollID: polls[1].ID, SongToBePlayed: "cro bad chick", CurrentAlcoholLevel: 2, PreferredAlcoholLevel: 4, FavoriteActivity: "karaoke", WishSnack: "Burger"},
		{PollID: polls[1].ID, SongToBePlayed: "dancing queen", CurrentAlcoholLevel: 2, PreferredAlcoholLevel: 3, FavoriteActivity: "dance", WishSnack: "Chips"},
		{PollID: polls[1].ID, SongToBePlayed: "last friday night", CurrentAlcoholLevel: 2, PreferredAlcoholLevel: 5, FavoriteActivity: "dance", WishSnack: "Muffins!!"},
		{PollID: polls[1].ID, SongToBePlayed: "snoop dog", CurrentAlcoholLevel: 2, PreferredAlcoholLevel: 4, FavoriteActivity: "dance", WishSnack: "idk"},
	}
	for _, result := range partyResults {
		if err := db.Create(&result).Error; err != nil {
			fmt.Printf("Failed to create poll party details for poll ID %s: %v\n", result.PollID, err)
			return
		}
	}

	weddingResults := []models.PollWedding{
		{PollID: polls[0].ID, WeddingInvite: "groom", KnowCoupleSince: 20, KnowCoupleFromWhere: "In einem Café", WeddingHighlight: "food", CoupleWish: "Super Flitterwochen"},
		{PollID: polls[0].ID, WeddingInvite: "bride", KnowCoupleSince: 10, KnowCoupleFromWhere: "Universität", WeddingHighlight: "afterParty", CoupleWish: "Glück und Gesundheit"},
		{PollID: polls[0].ID, WeddingInvite: "bride", KnowCoupleSince: 0, KnowCoupleFromWhere: "Verein", WeddingHighlight: "afterParty", CoupleWish: "Glück und Gesundheit"},
	}
	for _, result := range weddingResults {
		if err := db.Create(&result).Error; err != nil {
			fmt.Printf("Failed to create poll wedding details for poll ID %s: %v\n", result.PollID, err)
			return
		}
	}

	planningResults := []models.PollPlanning{
		{PollID: polls[2].ID, EssentialDrink: "Öttinger", EssentialFood: "Pizza", MusicToBePlayed: "rock", Activities: "photobooth", EventWish: "Partyhüte für alle"},
		{PollID: polls[2].ID, EssentialDrink: "Aperol", EssentialFood: "Gummibärchen", MusicToBePlayed: "pop", Activities: "karaoke", EventWish: "Planschbecken"},
	}
	for _, result := range planningResults {
		if err := db.Create(&result).Error; err != nil {
			fmt.Printf("Failed to create poll planning details for poll ID %s: %v\n", result.PollID, err)
			return
		}
	}

	fmt.Println("\nDatabase populated successfully.")
}

func hashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic("Failed to hash password: " + err.Error())
	}
	return string(hashedPassword)
}
