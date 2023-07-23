#!/bin/bash

echo "Starting application in development mode..."

docker-compose -f docker/dev/docker-compose.yml up --build

