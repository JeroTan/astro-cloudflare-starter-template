#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Use to get the directory of the current script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, 'template'); // Path to the template directory

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Use to ask questions in the terminal
function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}


// Main function to create the project
async function main() {
  const projectName = process.argv[2] || (await ask('Project name: ')); // If user type the command line with the project name or type command then ask later
  const projectLocation = process.argv[3] || (await ask('Where to create the project (. for current directory): ')) || '.'; // Ask for location or default to current directory
  rl.close(); // Close the readline interface or clean up

  const targetDir = path.resolve(process.cwd(), projectLocation);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${projectLocation}" already exists.`);
    process.exit(1);
  }

  fs.cpSync(templateDir, targetDir, { recursive: true });

  // Recursively replace placeholders in text files
  const replaceInFile = (filePath) => {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      fs.readdirSync(filePath).forEach(child => replaceInFile(path.join(filePath, child)));
    } else {
      const text = fs.readFileSync(filePath, 'utf8');
      const replaced = text.replace(/__PROJECT_NAME__/g, projectName);
      fs.writeFileSync(filePath, replaced);
    }
  };

  replaceInFile(targetDir);

  // After creating the project, install dependencies
  console.log(`\n✅ Project "${projectName}" created!`);
  console.log(`📦 Installing dependencies...`);
  
  try {
    // Run npm install in the project directory
    execSync('npm install', { 
      cwd: targetDir, 
      stdio: 'inherit' // This shows the npm output in real-time
    });
    
    console.log(`\n🎉 Project setup complete!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error(`\n❌ Failed to install dependencies: ${error.message}`);
    console.log(`\nYou can manually install them later:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  }
}

main();
