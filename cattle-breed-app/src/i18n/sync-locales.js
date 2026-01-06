const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const enPath = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Skip files that already have good translations
const skipFiles = ['en.json', 'hi.json', 'bn.json'];
const localeFiles = fs.readdirSync(localesDir)
  .filter(f => f.endsWith('.json') && !skipFiles.includes(f));

function addMissingKeys(target, source, prefix = '') {
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      addMissingKeys(target[key], source[key], prefix + key + '.');
    } else {
      if (!(key in target)) {
        // Add missing key with English placeholder
        target[key] = `[${source[key]}]`;
      }
    }
  }
}

let summary = [];
localeFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let before = JSON.stringify(data).length;
  
  addMissingKeys(data, enData);
  
  let after = JSON.stringify(data).length;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  
  let added = after - before;
  if (added > 0) {
    summary.push(`${file}: +${added} bytes`);
  }
});

console.log('✅ Locale sync complete!');
if (summary.length > 0) {
  console.log('\nUpdated files:');
  summary.forEach(s => console.log(`  - ${s}`));
} else {
  console.log('\nAll locales already up to date!');
}
