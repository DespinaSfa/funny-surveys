#!/bin/sh
echo "Creating .env file..."
cat << EOF > ./backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=daddy
DB_PASSWORD=bestvater
DB_NAME=partyPollDB
EOF
echo ".env file created."