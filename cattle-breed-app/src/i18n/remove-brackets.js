const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

// Get all locale files except en, hi, bn which are already good
const skipFiles = ['en.json', 'hi.json', 'bn.json'];
const localeFiles = fs.readdirSync(localesDir)
  .filter(f => f.endsWith('.json') && !skipFiles.includes(f));

function removeBrackets(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      removeBrackets(obj[key]);
    } else if (typeof obj[key] === 'string') {
      // Remove square brackets and keep the English text
      if (obj[key].startsWith('[') && obj[key].endsWith(']')) {
        obj[key] = obj[key].slice(1, -1);
      }
    }
  }
}

console.log('🔧 Removing square brackets from locale files...\n');

localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  removeBrackets(data);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n✅ All brackets removed! English text will be used as fallback until proper translations are added.');
