package server

import (
	"backend/config"
	"backend/db"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func InitServer() {
	dbConfig := config.LoadConfig()

	dbInstance, err := db.SetupDatabase(dbConfig)
	if err != nil {
		panic("error setting up database: " + err.Error())
	}

	r := chi.NewRouter()

	setupRoutes(r, dbInstance) // Pass the dbInstance to the setupRoutes function

	const port int = 3001

	fmt.Printf("\nServer running on http://localhost:%d", port)
	err = http.ListenAndServe(":3001", r)
	if err != nil {
		panic(err)
	}
}
