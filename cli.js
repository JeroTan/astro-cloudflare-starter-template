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

  // Optional KV namespace configuration
  // console.log('\n📦 KV Namespace Configuration (optional - press Enter to skip):');
  // const kvNamespace = await ask('KV Namespace binding name (e.g., KV_STORAGE): ');
  // const kvId = kvNamespace ? (await ask('KV Namespace ID: ')) : '';
  
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
      let replaced = text.replace(/x--project-name--x/g, projectName);
      
      // Replace KV namespace placeholders only in wrangler.jsonc
      // if (path.basename(filePath) === 'wrangler.jsonc') {
      //   if (kvNamespace) {
      //     replaced = replaced.replace(/x--kv-namespace--x/g, kvNamespace);
      //     replaced = replaced.replace(/x--kv-id--x/g, kvId || 'your-kv-namespace-id');
      //   } else {
      //     // If no KV namespace provided, keep placeholders for manual setup later
      //     replaced = replaced.replace(/x--kv-namespace--x/g, 'KV_STORAGE');
      //     replaced = replaced.replace(/x--kv-id--x/g, 'your-kv-namespace-id');
      //   }
      // }
      
      fs.writeFileSync(filePath, replaced);
    }
  };

  replaceInFile(targetDir);

  // After creating the project, install dependencies
  console.log(`\n✅ Project "${projectName}" created!`);
  
  // Loading animation for dependencies installation
  const frames = ['📦 Installing dependencies', '📦 Installing dependencies.', '📦 Installing dependencies..', '📦 Installing dependencies...'];
  let frameIndex = 0;
  
  const loadingInterval = setInterval(() => {
    process.stdout.write(`\r${frames[frameIndex]}`);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 500);
  
  try {
    // Run npm install in the project directory (without stdio: inherit to hide npm output during animation)
    execSync('npm install', { 
      cwd: targetDir, 
      stdio: 'pipe' // Hide npm output to keep animation clean
    });
    
    // Clear the animation and show success
    clearInterval(loadingInterval);
    process.stdout.write('\r📦 Dependencies installed successfully! ✅\n');
    
    console.log(`🎉 Project setup complete!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm run dev`);
  } catch (error) {
    // Clear the animation on error
    clearInterval(loadingInterval);
    process.stdout.write('\r');
    console.error(`❌ Failed to install dependencies: ${error.message}`);
    console.log(`\nYou can manually install them later:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  }
}

main();
