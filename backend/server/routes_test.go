package server

import (
	"log"
	"sync"
	"testing"
)

var wg sync.WaitGroup

func init() {
	wg.Add(1)
	go func() {
		InitServer(true)
		defer wg.Done()
	}()
}

func TestExampleRoute(t *testing.T) {
	// Start the server in testing mode
	log.Println("Test example route")
}
