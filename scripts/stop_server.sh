#!/bin/bash
set -e

echo "Running stop_server.sh..."

if command -v pm2 &> /dev/null; then
    echo "Stopping application with PM2..."
    pm2 stop aws-cicd-app || true
    pm2 delete aws-cicd-app || true
else
    echo "Stopping application with PID..."
    if [ -f /var/run/app.pid ]; then
        PID=$(cat /var/run/app.pid)
        kill $PID || true
        rm -f /var/run/app.pid
    fi
fi

echo "Application stopped"
