# will use multi stage later

# Base image
FROM node:18

# Set working directory
WORKDIR /client

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5173

# Start the application
CMD ["npm", "run","dev"]