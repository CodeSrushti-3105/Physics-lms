const fs = require('fs');
const path = require('path');

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (err) {
    return 0;
  }
}

function scanDirectory(dir, extension) {
  let totalLines = 0;
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith(extension)) {
        const lines = countLines(fullPath);
        totalLines += lines;
        files.push({ file: fullPath.replace(dir + path.sep, ''), lines });
      }
    });
  }
  
  scan(dir);
  return { totalLines, files };
}

console.log('=== BACKEND (JavaScript) ===');
const backend = scanDirectory('./backend', '.js');
backend.files.forEach(f => console.log(`${f.file}: ${f.lines} lines`));
console.log(`Backend Total: ${backend.totalLines} lines\n`);

console.log('=== FRONTEND (JavaScript) ===');
const frontend = scanDirectory('./frontend/src', '.js');
frontend.files.forEach(f => console.log(`${f.file}: ${f.lines} lines`));
console.log(`Frontend Total: ${frontend.totalLines} lines\n`);

console.log('=== FRONTEND (CSS) ===');
const css = scanDirectory('./frontend/src/styles', '.css');
css.files.forEach(f => console.log(`${f.file}: ${f.lines} lines`));
console.log(`CSS Total: ${css.totalLines} lines\n`);

const total = backend.totalLines + frontend.totalLines + css.totalLines;
console.log(`=== TOTAL ===`);
console.log(`Total Lines: ${total}`);
console.log(`KLOC: ${(total / 1000).toFixed(2)}`);
