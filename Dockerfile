# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Expose port (3000 or your app's port)
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
