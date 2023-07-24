#!/bin/bash

SERVER="http://localhost:3000"

# Get the current date and time in a specific format
current_date=$(date +"%Y%m%d%H%M%S")

echo "Please enter the number of tests for each endpoint: "
read COUNT

if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
    echo "Error: Input must be an integer."
    exit 1
fi

read -r -p "This script will make $COUNT requests to each endpoint with a different user and this will take some time. Do you want to continue? (Y/n) " response
response=$(echo "$response" | tr '[:upper:]' '[:lower:]')

if [[ "$response" =~ ^(n|no)$ ]]; then
    echo "You chose not to continue. Exiting..."
    exit 1
fi

make_requests() {
    local endpoint=$1
    local token=$2
    local type=$3

    # Print progress bar
    print_progress() {
        local text=$1
        local percent=$2
        local filled=$((percent / 2))
        local unfilled=$((50 - filled))
        printf "$text [%-50s] %d%%\r" "$(printf "%-${filled}s" "" | tr ' ' '=')>$(printf "%-${unfilled}s" "")" "$percent" 
    }

    # Loop to make count number of requests to endpoint
    for i in $(seq 1 $COUNT); do
        output=$(curl -s -D - -w "%{http_code}\n" -H "x-access-token: $token" $SERVER$endpoint)

        # Extract the HTTP status code, date, and rate limit headers from the output
        status_code=$(echo "$output" | grep -Eo '[0-9]{3}$')
        date_now=$(date +"%Y%m%d%H%M%S")

        rate_limit_reset=$(echo "$output" | grep -i '^X-RateLimit-Reset:' | awk -F': ' '{print $2}' | tr -d '\r')
        rate_limit_remaining=$(echo "$output" | grep -i '^X-RateLimit-Remaining:' | awk -F': ' '{print $2}' | tr -d '\r')
        rate_limit_weight=$(echo "$output" | grep -i '^X-RateLimit-Weight:' | awk -F': ' '{print $2}' | tr -d '\r')

        # Append the result to the log file
        echo "$date_now  Endpoint: $type \"$endpoint\"  $status_code Rate Limit Reset: $rate_limit_reset Rate Limit Remaining: $rate_limit_remaining Rate Limit Weight: $rate_limit_weight" >>"test_${current_date}.log"

        # Update the progress bar
        print_progress "Endpoint: $endpoint" $((i * 100 / COUNT))
    done
}

# Test the public endpoint
make_requests "/" "" "PUBLIC"

# List of private endpoints
endpoints=(
    '/json-placeholder'
    '/cat-facts'
    '/dog-api'
    '/rick-and-morty'
    '/joke-api'
)

for endpoint in "${endpoints[@]}"; do
    # Make a POST request to '/create-user' to get a token
    response=$(curl -s -X POST $SERVER/create-user)
    token=$(echo $response | jq -r '.["x-access-token"]')

    # Check if token is not empty
    if [ -z "$token" ]; then
        echo "Failed to get token"
        exit 1
    fi

    # Test the private endpoint
    make_requests "$endpoint" "$token" "PRIVATE"
done

echo "All tests completed successfully! results saved to ./test_${current_date}.log"
