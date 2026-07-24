#!/bin/bash
set -e

echo "Running after_install.sh..."

cd /var/www/app

echo "Installing Node.js dependencies..."
npm ci --production

echo "Setting permissions..."
chown -R ec2-user:ec2-user /var/www/app
chown -R ec2-user:ec2-user /var/log/app

echo "Dependencies installed successfully"
