const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');
const backupFile = path.join(__dirname, '.env.backup');

if (fs.existsSync(envFile)) {
  fs.copyFileSync(envFile, backupFile);
  console.log('✅ .env file backed up to .env.backup');
  console.log(`📁 Location: ${backupFile}`);
} else {
  console.log('❌ .env file not found!');
}