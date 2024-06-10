FROM golang:1.22.2 as build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM nginx:alpine

# Copy the built Go application from the builder stage
COPY --from=builder /app/main /usr/bin/main

EXPOSE 3001

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]