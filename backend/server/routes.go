package server

import (
	"backend/db"
	_ "backend/docs"
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5/middleware"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	httpSwagger "github.com/swaggo/http-swagger"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Server struct {
	DBInst *gorm.DB
}

// GetPollsHandler godoc
// @Summary  Get all polls w/o results
// @Tags Polls
// @Produce      json
// @Success      200  {array}   models.PollInfo
//
// @Router       /polls [get]
func (s *Server) GetPollsHandler(w http.ResponseWriter, r *http.Request) {
	// Get User ID from the auth-header
	userID, err := GetUserId(r)
	if err != nil {
		fmt.Println("Error getting user ID from token:", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Read user polls
	polls, err := db.ReadUserPolls(*userID)
	if err != nil {
		fmt.Println("Error reading user polls:", err)
		http.Error(w, "Failed to read user polls", http.StatusInternalServerError)
		return
	}

	pollsJSON, err := json.Marshal(polls)
	if err != nil {
		fmt.Println("Error marshaling JSON response:", err)
		http.Error(w, "Failed to marshal JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(pollsJSON)
	if err != nil {
		fmt.Println("Error writing response:", err)
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
		return
	}
}

// PostPollsHandler godoc
// @Summary Post a poll
// @Tags Polls
// @Accepts      json
// @Success      200  {array}   models.PollInfo
//
//	@Param			poll	body		models.PollInfo	true	"Add Poll"
//
// @Router       /polls [post]
func (s *Server) PostPollsHandler(w http.ResponseWriter, r *http.Request) {
	// Get User ID from the auth-header
	userID, err := GetUserId(r)
	if err != nil {
		fmt.Println("Error getting user ID from token:", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	fmt.Println("Received POST request to /polls")
	fmt.Println("Request Body:", string(body))

	type PollPostBody struct {
		UserID      int    `json:"userID"`
		PollType    string `json:"pollType"`
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	var requestBody PollPostBody
	err = json.Unmarshal(body, &requestBody)
	if err != nil {
		fmt.Println("Error parsing request body:", err)
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	newPoll := &models.Poll{
		UserID:      uint(*userID),
		Title:       requestBody.Title,
		Description: requestBody.Description,
		PollType:    requestBody.PollType,
	}

	createdPoll, err := db.CreatePoll(s.DBInst, newPoll)
	if err != nil {
		fmt.Println("Error creating poll:", err)
		http.Error(w, "Failed to create poll", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"message": "Poll created successfully",
		"status":  "OK",
		"pollID":  createdPoll.ID,
	}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Print("Error marshaling JSON response:", err)
		http.Error(w, "Failed to marshal JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if _, err := w.Write(jsonResponse); err != nil {
		fmt.Println("Error writing response:", err)
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
		return
	}
}

// DeletePollByIDHandler godoc
//
//		@Summary		Delete a poll
//	    @Tags           Polls
//		@Accept			json
//		@Produce		json
//		@Param			id	path		string	true	"Poll ID"
//		@Success		204	string Poll successfully deleted
//		@Router			/polls/{id} [delete]
//
// DeletePollByIDHandler handles the deletion of a poll by ID
func (s *Server) DeletePollByIDHandler(w http.ResponseWriter, r *http.Request) {
	// Get User ID from the auth-header
	userID, err := GetUserId(r)
	if err != nil {
		fmt.Println("Error getting user ID from token:", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Extract poll ID from URL
	pollIDStr := chi.URLParam(r, "pollId")

	// Read poll from the database
	poll, err := db.ReadPollByID(s.DBInst, pollIDStr)
	if err != nil {
		fmt.Println("Error reading poll from database:", err)
		http.Error(w, "Poll not found", http.StatusNotFound)
		return
	}

	// Check if the user ID matches the poll owner ID
	if poll.UserID != uint(*userID) {
		http.Error(w, "Forbidden: user is not allowed to delete this poll", http.StatusForbidden)
		return
	}

	// Run DeletePollByID
	err = db.DeletePollByID(s.DBInst, pollIDStr)
	if err != nil {
		http.Error(w, "Failed to delete poll: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GetPollByIDHandler godoc
// @Summary  Get a poll and it's results
// @Tags Polls
// @Produce      json
// @Success      200  string Add model
// @Param		 id	path		string	true	"Poll ID"
// @Router       /polls/{id} [get]
func (s *Server) GetPollByIDHandler(w http.ResponseWriter, r *http.Request) {
	pollID := chi.URLParam(r, "pollId")

	poll, err := db.ReadPollByID(s.DBInst, pollID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Poll not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to retrieve poll", http.StatusInternalServerError)
		return
	}

	pollJSON, err := json.Marshal(poll)
	if err != nil {
		http.Error(w, "Failed to marshal poll to JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(pollJSON)
	if err != nil {
		fmt.Println("Error writing response:", err)
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
		return
	}
}

func (s *Server) CheckTokenValid(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// PostPollByIDHandler godoc
// @Summary  Post a poll result
// @Tags Polls
// @Produce      json
// @Success      200   string Poll result added successfully
// @Param		 id	    path  string	                    true	"Poll ID"
// @Param		 poll	body  models.GenericPollResponse    true	 "Add poll response"
// @Router       /polls/{id} [post]
func (s *Server) PostPollByIDHandler(w http.ResponseWriter, r *http.Request) {
	pollIDStr := chi.URLParam(r, "pollId")

	// Validate poll ID as UUID
	if _, err := uuid.Parse(pollIDStr); err != nil {
		fmt.Println("Invalid poll ID:", err)
		http.Error(w, "Invalid poll ID", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading request body:", err)
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	var pollResponseData models.GenericPollResponse
	if err := json.Unmarshal(body, &pollResponseData); err != nil {
		fmt.Println("Error parsing request body:", err)
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Associate the response data with the poll ID
	pollResponseData.PollID = pollIDStr

	// Marshal the response data back to JSON for storing in DB (if needed)
	pollResponseJSON, err := json.Marshal(pollResponseData)
	if err != nil {
		fmt.Println("Error marshaling poll response data:", err)
		http.Error(w, "Failed to marshal poll response data", http.StatusInternalServerError)
		return
	}

	// Save the poll response to the database
	if err := db.CreatePollResponse(s.DBInst, []byte(pollResponseJSON)); err != nil {
		fmt.Println("Error creating poll response:", err)
		http.Error(w, "Failed to create poll response", http.StatusInternalServerError)
		return
	}

	response := map[string]string{"message": "Poll response created successfully", "status": "OK"}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Println("Error marshaling JSON response:", err)
		http.Error(w, "Failed to marshal JSON response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(jsonResponse)
	if err != nil {
		fmt.Println("Error writing response:", err)
		http.Error(w, "Failed to write response", http.StatusInternalServerError)
		return
	}
}

// This struct is needed to generate the correct Swagger documentation example.
type QRRequest struct {
	URL string `json:"url"`
}

// GenerateQRHandler handles requests to generate QR codes from URLs
// @Summary Generate QR code
// @Description Generate a QR code from the provided URL
// @Tags QR
// @Accept  json
// @Produce  png
// @Param   qrRequest body QRRequest true "QR request"
// @Example {json} QR request example:
//
//	{
//	  "url": "https://example.com"
//	}
//
// @Success 200 {file} file "QR code image"
// @Failure 400 {object} string "Invalid request format"
// @Failure 500 {object} string "Failed to generate QR code"
// @Router /qr [post]
func (s *Server) GenerateQRHandler(w http.ResponseWriter, r *http.Request) {
	var qrRequest map[string]string

	// Read and decode the request body
	if err := json.NewDecoder(r.Body).Decode(&qrRequest); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		fmt.Println("Error parsing request body:", err)
		return
	}

	// Get the URL from the map
	url, exists := qrRequest["url"]
	if !exists {
		http.Error(w, "URL not provided", http.StatusBadRequest)
		return
	}

	// Generate the QR code bytes from the URL
	qrBytes, err := generateQR(url)
	if err != nil {
		http.Error(w, "Failed to generate QR code", http.StatusInternalServerError)
		fmt.Println("Error generating QR code:", err)
		return
	}

	// Set header for content type to 'image/png'
	w.Header().Set("Content-Type", "image/png")

	// Write the QR code byte slice to the response
	if _, err := w.Write(qrBytes); err != nil {
		http.Error(w, "Failed to send QR code", http.StatusInternalServerError)
		fmt.Println("Error writing response:", err)
	}
}

// RefreshToken godoc TODO
// @Summary Create a refresh token
// @Tags Auth
// @Router	/refresh-token [post]
func (s *Server) RefreshToken(w http.ResponseWriter, r *http.Request) {
	// Parse the refresh token from the request body
	var requestBody struct {
		RefreshToken string `json:"refreshToken"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(float64)
	// Verify the refresh token and get a new access token
	_, err = RefreshToken(requestBody.RefreshToken, userID)
	if err != nil {
		http.Error(w, "Failed to verify refresh token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	newToken, err := CreateToken(userID)
	if err != nil {
		http.Error(w, "Failed to create token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	newRefreshToken, err := CreateRefreshToken(userID)
	if err != nil {
		http.Error(w, "Failed to create refresh token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the new access token
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": newToken, "refreshToken": newRefreshToken})
}

// LoginHandler godoc TODO
// @Summary  Login an existing user
// @Tags Auth
// @Router       /login [post]
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Look up the user in the database
	user, err := db.GetUserByUsername(credentials.Username)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	// Check the password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := CreateToken(float64(user.ID))
	if err != nil {
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	refreshToken, err := CreateRefreshToken(float64(user.ID))
	if err != nil {
		http.Error(w, "Failed to create refresh token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token, "refreshToken": refreshToken})
}

func setupRoutes(r chi.Router, dbInstance *gorm.DB) {
	server := &Server{DBInst: dbInstance}

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(corsMiddleware)

	// Public routes (no auth middleware)
	r.Group(func(r chi.Router) {
		r.Mount("/swagger", httpSwagger.WrapHandler)
		r.Post("/login", server.LoginHandler)
		r.Get("/polls/{pollId}", server.GetPollByIDHandler)
		r.Post("/polls/{pollId}", server.PostPollByIDHandler)
	})

	// Routes with auth middleware
	r.Group(func(r chi.Router) {
		r.Use(AuthenticationMiddleware)
		r.Post("/refresh-token", server.RefreshToken)
		r.Get("/qr", server.GenerateQRHandler)
		r.Get("/check-token-valid", server.CheckTokenValid)
		r.Get("/polls", server.GetPollsHandler)
		r.Post("/polls", server.PostPollsHandler)
		r.Delete("/polls/{pollId}", server.DeletePollByIDHandler)
	})
}
