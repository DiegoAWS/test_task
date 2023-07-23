#!/bin/bash

echo "Starting application in production mode..."

docker-compose -f docker/prod/docker-compose.yml up --build -d
