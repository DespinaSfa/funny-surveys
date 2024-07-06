package models

type UserStats struct {
	TotalPolls       int    `json:"totalPolls"`
	TotalAnswers     int    `json:"totalAnswers"`
	MostPopularPoll  string `json:"mostPopularPoll"`
	LeastPopularPoll string `json:"leastPopularPoll"`
}
