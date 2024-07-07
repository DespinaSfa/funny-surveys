package server

import (
	"os"
	"testing"
)

func TestWriteToFile(t *testing.T) {
	data := []byte("test data")
	fileName := "testfile.txt"

	err := WriteToFile(fileName, data)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	writtenData, err := os.ReadFile(fileName)
	if err != nil {
		t.Fatalf("Expected no error reading the file, got %v", err)
	}

	if string(writtenData) != string(data) {
		t.Fatalf("Expected file content to be %s, got %s", data, writtenData)
	}

	err = os.Remove(fileName)
	if err != nil {
		return
	}
}

func TestGenerateQR(t *testing.T) {
	url := "https://example.com"
	qrBytes, err := GenerateQR(url)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if len(qrBytes) == 0 {
		t.Fatalf("Expected QR bytes length to be greater than 0")
	}

	err = WriteToFile("testqr.png", qrBytes)
	if err != nil {
		t.Fatalf("Expected no error writing QR code to file, got %v", err)
	}

	err = os.Remove("testqr.png")
	if err != nil {
		return
	}
}
