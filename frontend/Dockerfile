FROM node:latest as build

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve the React app using nginx
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port nginx is running on
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
