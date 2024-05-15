// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/login": {
            "post": {
                "tags": [
                    "Auth"
                ],
                "summary": "Login an existing user",
                "responses": {}
            }
        },
        "/polls": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Polls"
                ],
                "summary": "Get all polls w/o results",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.PollInfo"
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "Polls"
                ],
                "summary": "Post a poll",
                "parameters": [
                    {
                        "description": "Add Poll",
                        "name": "poll",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.PollInfo"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.PollInfo"
                            }
                        }
                    }
                }
            }
        },
        "/polls/{id}": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Polls"
                ],
                "summary": "Get a poll and it's results",
                "parameters": [
                    {
                        "type": "integer",
                        "format": "int64",
                        "description": "Poll ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            },
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Polls"
                ],
                "summary": "Post a poll result",
                "parameters": [
                    {
                        "type": "integer",
                        "format": "int64",
                        "description": "Poll ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            },
            "delete": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Polls"
                ],
                "summary": "Delete a poll",
                "parameters": [
                    {
                        "type": "integer",
                        "format": "int64",
                        "description": "Poll ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "204": {
                        "description": "No Content",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/refresh-token": {
            "post": {
                "tags": [
                    "Auth"
                ],
                "summary": "Create a refresh token",
                "responses": {}
            }
        }
    },
    "definitions": {
        "models.PollInfo": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "pollType": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:3001",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "PartyPoll API",
	Description:      "This is the API for the PartyPoll web application",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
