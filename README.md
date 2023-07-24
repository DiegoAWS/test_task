# API Rate Limiter Project

This project is a simple demonstration of a rate-limiter for an API, restricting the usage of the API to prevent users from abusing the system. The project involves a basic authentication middleware and private/public routes with different request rate limits.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker](#running-with-docker)
  - [Running without Docker](#running-without-docker)
- [Project Design](#project-design)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)

## Getting Started

This section provides instructions on how to get a copy of the project running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you will need to have the following installed:

- Docker
or

- Node.js
- Redis

### Running with Docker

#### Development

To run the development version of the project with Docker, navigate to the root directory of the project and use the following command:

```sh
bash start-app-dev.sh
```

This command will start the API server and the Redis server. The API server will run on port `3000`, and the Redis server will be exposed on port `6379`.

#### Production

For running the production version, use the following command:

```sh
bash start-app-prod.sh
```

The API server will be available on port `3000`.

### Running without Docker

To run the project without Docker, you need to start MongoDB and Redis on your machine first. After that, you can navigate to the root directory of the project and run the following commands:

```sh
# Install dependencies
npm install

# Run the API server
npm start
```

Aditionally you'll need to have a redis server running and update the key `REDIS_URL` in `app/.env`.

The server will start on port `3000`.

## Project Design

This project implements a rate limiter for both public and private routes. The rate limiter restricts requests based on the client's IP address for public routes and based on the authentication token for private routes.

- The rate limit for token-based requests is 200 req/hour.
- The rate limit for IP-based requests is 100 req/hour.

These rate limit values can be configured from the environment variables. When a user reaches the limit, an error message is shown in the response, specifying the current limit for that user account, and when the user can make the next request.

As an optional task, this project provides different weights of request rate for every URL.

## API Documentation

Detailed API documentation is available at `http://localhost:3000/`.

## Running Tests

To run tests, use the following command:

```sh
bash test/test-script.sh
```

And a `.log` file will be generated with the test results like [this](test/test_20230724033551.log) one.
