@echo off
echo Checking for .env file...

:: Check if .env file exists
if not exist .env (
  echo Creating .env file from .env.docker template
  copy .env.docker .env
  echo Please update the .env file with your actual credentials
  pause
  exit /b 1
)

:: Build and run the Docker container
echo Building and starting Docker container...
docker-compose up --build

:: Instructions for when user stops the container
echo Docker container stopped. To restart without rebuilding, run: docker-compose up
echo To rebuild and restart, run: docker-compose up --build
pause