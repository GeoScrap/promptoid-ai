// This script is used for Vercel builds
const { execSync } = require('child_process');

try {
  console.log('Starting Vercel build process...');

  // Build Next.js app
  console.log('Building Next.js app...');
  execSync('next build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
