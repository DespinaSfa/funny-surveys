package models

import "gorm.io/gorm"

type Poll struct {
	gorm.Model
	UserID      uint
	Title       string
	Description string
	PollType    string

	//This tells GORM that there is a one-to-many relationship between Poll and PollParty and between Poll and PollWedding
	PollParties  []PollParty   `gorm:"foreignKey:PollID"`
	PollWeddings []PollWedding `gorm:"foreignKey:PollID"`
}
