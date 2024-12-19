# Use Node.js LTS (iron) as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (leveraging Docker cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Expose Vite's default port
EXPOSE 5173

# Add a non-root user for security
RUN adduser -D nodeuser
RUN chown -R nodeuser:nodeuser /app
USER nodeuser

# Start the development server
CMD ["npm", "run", "dev"]