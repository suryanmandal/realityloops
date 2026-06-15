#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
let port = '3000'; // default port

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const portMatch = envContent.match(/^PORT=(.+)$/m);
    if (portMatch) {
        port = portMatch[1].trim();
    }
}

console.log(`Starting Next.js production server on port ${port}...`);

// Start Next.js with the port
const child = spawn('npx', ['next', 'start', '-p', port], {
    stdio: 'inherit',
    shell: true
});

child.on('exit', (code) => {
    process.exit(code);
});
