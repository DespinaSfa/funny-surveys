FROM golang:1.22.2 as build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Install swag CLI
RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY . .

# Initialize Swagger
RUN swag init

RUN go build -o main .

FROM nginx:alpine

COPY --from=build /app/main /usr/bin/main

EXPOSE 3001

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
