#!/bin/bash

# Update code from repository
git pull origin master

# Install dependencies
npm install

# Restart the application using PM2
pm2 restart evara-ecommerce || pm2 start server.js --name evara-ecommerce