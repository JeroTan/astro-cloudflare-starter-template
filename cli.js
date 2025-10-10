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

  // Rename gitignore.template back to .gitignore
  const gitignoreTemplatePath = path.join(targetDir, 'gitignore.template');
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (fs.existsSync(gitignoreTemplatePath)) {
    fs.renameSync(gitignoreTemplatePath, gitignorePath);
  }

  // After creating the project, install dependencies
  console.log(`\n✅ Project "${projectName}" created!`);
  console.log('\n📦 Installing dependencies...');
  
  try {
    // Run npm install in the project directory
    execSync('npm install', { 
      cwd: targetDir, 
      stdio: 'inherit' // Show npm output normally
    });
    
    // Clear the animation and show success
    console.log('✅ Dependencies installed successfully!');
    
    console.log(`🎉 Project setup complete!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm run dev`);
  } catch (error) {
    // Clear the animation on error
    console.error(`❌ Failed to install dependencies: ${error.message}`);
    console.log(`\nYou can manually install them later:`);
    console.log(`  cd ${path.basename(targetDir)}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  }
}

main();
