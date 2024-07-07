package main

import (
	"backend/server"
	"time"
)

// @title           PartyPoll API
// @version         1.0
// @description     This is the API for the PartyPoll web application
// @host            localhost:3001
func main() {
	// Initialize the server
	time.Sleep(10 * time.Second)
	server.InitServer(false)

}
