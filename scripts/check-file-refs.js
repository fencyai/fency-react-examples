#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkFileRefs() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const fileRefs = [];

  // Check dependencies
  if (packageJson.dependencies) {
    Object.entries(packageJson.dependencies).forEach(([name, version]) => {
      if (typeof version === 'string' && version.startsWith('file:../')) {
        fileRefs.push(`dependencies.${name}: ${version}`);
      }
    });
  }

  // Check devDependencies
  if (packageJson.devDependencies) {
    Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
      if (typeof version === 'string' && version.startsWith('file:../')) {
        fileRefs.push(`devDependencies.${name}: ${version}`);
      }
    });
  }

  // Check peerDependencies
  if (packageJson.peerDependencies) {
    Object.entries(packageJson.peerDependencies).forEach(([name, version]) => {
      if (typeof version === 'string' && version.startsWith('file:../')) {
        fileRefs.push(`peerDependencies.${name}: ${version}`);
      }
    });
  }

  if (fileRefs.length > 0) {
    console.error('❌ Found file:../ references in package.json:');
    fileRefs.forEach(ref => {
      console.error(`   - ${ref}`);
    });
    console.error('\n🚫 Pre-commit blocked: file:../ references are not allowed in production builds.');
    console.error('   Please use published versions or relative paths within the same repository.');
    process.exit(1);
  }

  console.log('✅ No file:../ references found in package.json');
}

checkFileRefs(); 