#!/bin/bash
set -e

echo "Running start_server.sh..."

cd /var/www/app

export NODE_ENV=production
export PORT=3000

if command -v pm2 &> /dev/null; then
    echo "Using PM2 to start application..."
    pm2 start src/server.js --name "aws-cicd-app" -i max
    pm2 save
    pm2 startup
else
    echo "PM2 not found, starting with nohup..."
    nohup node src/server.js > /var/log/app/app.log 2>&1 &
    echo $! > /var/run/app.pid
fi

echo "Application started successfully"
sleep 5

if curl -f http://localhost:3000/api/health; then
    echo "Health check passed"
else
    echo "Health check failed"
    exit 1
fi
