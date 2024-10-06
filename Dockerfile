# Use an official Node.js runtime as a parent image
FROM node:20-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Run the app
CMD ["npm", "run", "dev"]