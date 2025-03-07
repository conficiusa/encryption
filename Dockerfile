FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Create directory for the shared library in the system lib path
RUN mkdir -p /usr/lib/mongodb-crypt/ && \
    # Copy the MongoDB crypt shared library from the project to the system directory
    cp src/utils/mongo_crypt_v1.so /usr/lib/mongodb-crypt/libmongocrypt.so && \
    # Make sure the library is discoverable
    ldconfig

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV PLATFORM=docker

# Expose the port
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]