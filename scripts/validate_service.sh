#!/bin/bash
set -e

echo "Running validate_service.sh..."

sleep 10

MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000/api/health; then
        echo "Service validation passed"
        exit 0
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Retry $RETRY_COUNT/$MAX_RETRIES..."
    sleep 5
done

echo "Service validation failed after $MAX_RETRIES retries"
exit 1
