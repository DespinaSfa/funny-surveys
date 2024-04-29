package models

import "gorm.io/gorm"

type Poll struct {
	gorm.Model
	User        User
	UserID      uint
	Title       string
	Description string
	PollType    string
}

type PollParty struct {
	gorm.Model
	Poll                  Poll
	PollID                uint
	SongToBePlayed        string
	CurrentAlcoholLevel   int
	PreferredAlcoholLevel int
	FavoriteActivity      string
	WishSnack             string
}

type PollWedding struct {
	gorm.Model
	Poll                Poll
	PollID              uint
	WeddingInvite       string
	KnowCoupleSince     int
	KnowCoupleFromWhere string
	WeddingHighlight    string
	CoupleWish          string
}
