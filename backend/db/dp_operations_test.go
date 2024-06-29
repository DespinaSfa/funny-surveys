package db

import (
	"fmt"
	_ "sync"
	"testing"
	_ "time"
)

func init() {
	//setup database here like in init server
	//everything here happens before the test
}

func TestExample(t *testing.T) {
	fmt.Print("Test example")
}
