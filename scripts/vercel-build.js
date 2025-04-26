// This script is used for Vercel builds to avoid database connection issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

try {
  console.log('Starting Vercel build process...');
  
  // Generate Prisma client without accessing the database
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build Next.js app
  console.log('Building Next.js app...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
