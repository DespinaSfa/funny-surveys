package server

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("secret_key")
var refreshKey = []byte("refresh_secret_key")

func CreateToken(userID float64) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Minute * 24).Unix()
	claims["iat"] = time.Now().Unix()

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func getUserIdFromToken(tokenStr string) (*int, error) {
	claims := &jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*jwt.MapClaims); ok && token.Valid {
		if userID, ok := (*claims)["user_id"].(float64); ok {
			userIDInt := int(userID)
			return &userIDInt, nil
		}
		return nil, errors.New("user_id not found in token")
	}

	return nil, errors.New("invalid token")
}

func GetUserId(r *http.Request) (*int, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return nil, errors.New("authorization header missing")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return nil, errors.New("invalid authorization header format")
	}

	return getUserIdFromToken(parts[1])
}

func RefreshToken(refreshTokenStr string, userID float64) (string, error) {
	claims := &jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(refreshTokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return refreshKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(*jwt.MapClaims); ok && token.Valid {
		userIdFromToken := (*claims)["user_id"].(float64)
		if userIdFromToken != userID {
			return "", fmt.Errorf("invalid refresh token")
		}

		newToken, err := CreateToken(userIdFromToken)
		if err != nil {
			return "", err
		}

		return newToken, nil
	}

	return "", fmt.Errorf("invalid refresh token")
}

func CreateRefreshToken(userID float64) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	claims["iat"] = time.Now().Unix()

	tokenString, err := token.SignedString(refreshKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
