# Docker Setup for MongoDB CSFLE Project

This document explains how the Docker setup works for this MongoDB Client-Side Field Level Encryption (CSFLE) project.

## Overview

This project uses Docker to containerize a Node.js Express API that encrypts medical records using MongoDB's Client-Side Field Level Encryption (CSFLE). The Docker setup handles the platform-specific requirements for CSFLE, specifically the need for the MongoDB crypt shared library.

## MongoDB Encryption Libraries

The project includes platform-specific encryption libraries:

- `src/utils/mongo_crypt_v1.dll` - Used on Windows systems
- `src/utils/mongo_crypt_v1.so` - Used in the Docker container (Linux)

## Docker Configuration Files

### Dockerfile

The Dockerfile:

1. Uses `node:18` as a base image
2. Copies the pre-downloaded MongoDB crypt shared library (`mongo_crypt_v1.so`) to the system library path
3. Installs Node.js dependencies
4. Sets up environment variables for the application
5. Configures the application to run on port 8000

### docker-compose.yml

The docker-compose.yml file:

1. Builds the application using the Dockerfile
2. Maps port 8000 from the container to port 8000 on the host
3. Sets environment variables for the application
4. Configures the container to restart unless stopped manually

## Platform Detection

The application is configured to detect whether it's running in Docker or on a local Windows machine:

- In Docker: The application uses the MongoDB crypt shared library copied to `/usr/lib/mongodb-crypt/libmongocrypt.so`
- On Windows: The application uses the local `mongo_crypt_v1.dll` file in the `src/utils` directory

This is handled by the `encryptionClient.js` file which checks for the `PLATFORM` environment variable.

## Running the Application with Docker

To run the application with Docker:

1. Make sure Docker Desktop is running
2. Copy `.env.docker` to `.env` (or use the provided batch/shell scripts)
3. Run `docker-compose up --build` to build and start the container

You can also use the provided convenience scripts:

- `docker-run.bat` (Windows)
- `docker-run.sh` (Linux/macOS)

## Troubleshooting

If you encounter issues:

1. Check that the MongoDB crypt shared library has been correctly copied to `/usr/lib/mongodb-crypt/libmongocrypt.so`
2. Verify that all environment variables are properly set in the `.env` file
3. Check the Docker logs for any error messages
4. Ensure the MongoDB connection string in the `.env` file is accessible from within the container

## Production Deployment

For production deployment:

1. Remove any sensitive information from the Dockerfile and docker-compose.yml
2. Use environment variables or Docker secrets for sensitive information
3. Consider using a container orchestration service like Kubernetes or Docker Swarm
4. Implement proper monitoring and logging
