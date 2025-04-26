// This script is used to run migrations on Vercel deployment
const { execSync } = require('child_process');

// Run the migration
try {
  console.log('Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Error running migrations:', error);
  process.exit(1);
}
