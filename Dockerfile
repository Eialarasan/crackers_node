# Stage 1: Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including dev (needed for wait-on and sequelize-cli)
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (match your Node.js app)
EXPOSE 3000

# Start app: wait for MySQL, run all seeders, then start app
CMD ["sh", "-c", "npx wait-on tcp:3306 && npx sequelize db:seed:all && node index.js"]
