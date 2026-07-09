import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';

// 1. Build the React App
console.log('--- Starting Production Build ---');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
}

// 2. Read dist directory recursively
const distDir = path.resolve('dist');
const zip = new JSZip();

function addDirectoryToZip(zipObj, dirPath, rootPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(rootPath, fullPath);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      addDirectoryToZip(zipObj, fullPath, rootPath);
    } else {
      const fileData = fs.readFileSync(fullPath);
      // Ensure forward slashes in zip entries for compatibility
      const zipPath = relativePath.replace(/\\/g, '/');
      zipObj.file(zipPath, fileData);
    }
  }
}

console.log('--- Bundling SCORM 1.2 Package ---');
if (fs.existsSync(distDir)) {
  addDirectoryToZip(zip, distDir, distDir);
  
  zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
    // Write to root
    fs.writeFileSync('scorm-package.zip', content);
    console.log('âœ… SCORM package created in workspace root: scorm-package.zip');
    
    // Also copy to public folder so it can be served dynamically in dev mode
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync('public/scorm-package.zip', content);
    console.log('âœ… SCORM package copied to public/scorm-package.zip');
  }).catch((err) => {
    console.error('Error generating ZIP:', err);
  });
} else {
  console.error('Build directory "dist" does not exist!');
}
