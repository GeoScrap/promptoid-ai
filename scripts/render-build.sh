#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install

# Generate Prisma client without accessing the database
npx prisma generate

# Build Next.js app without database migrations
NODE_OPTIONS="--max-old-space-size=4096" next build

# Note: Database migrations will be handled separately after deployment
