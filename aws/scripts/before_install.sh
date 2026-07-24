#!/bin/bash
set -e

echo "Running before_install.sh..."
echo "Deployment group: $DEPLOYMENT_GROUP_NAME"
echo "Application name: $APPLICATION_NAME"

if [ -d "/var/www/app" ]; then
    echo "Cleaning up previous deployment..."
    rm -rf /var/www/app
fi

mkdir -p /var/www/app
mkdir -p /var/log/app
