package models

import "gorm.io/gorm"

type Poll3 struct {
	gorm.Model
	User        User
	UserID      uint
	Title       string
	Description string
	Text        string
}
