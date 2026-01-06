const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

// Read English file as reference
const enPath = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Function to get all keys recursively
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Function to get value by dot notation path
function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Function to set value by dot notation path
function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

const allEnKeys = getAllKeys(enData);
console.log(`\n📋 Total keys in English: ${allEnKeys.length}\n`);

// Get all language files
const langFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

let totalFixed = 0;

langFiles.forEach(file => {
  const lang = file.replace('.json', '');
  if (lang === 'en') return; // Skip English
  
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let missingKeys = [];
  allEnKeys.forEach(key => {
    const value = getValueByPath(data, key);
    const enValue = getValueByPath(enData, key);
    
    // Check if key is missing or still in English (not translated)
    if (!value || value === enValue) {
      missingKeys.push(key);
    }
  });
  
  if (missingKeys.length > 0) {
    console.log(`\n⚠️  ${lang}.json - Missing/Untranslated: ${missingKeys.length} keys`);
    console.log(`   Sample missing keys: ${missingKeys.slice(0, 5).join(', ')}`);
    
    // Copy English values for missing keys (better than nothing)
    missingKeys.forEach(key => {
      const enValue = getValueByPath(enData, key);
      setValueByPath(data, key, enValue);
    });
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    totalFixed += missingKeys.length;
    console.log(`   ✅ Added ${missingKeys.length} missing keys with English fallback`);
  } else {
    console.log(`✅ ${lang}.json - Complete (${allEnKeys.length} keys)`);
  }
});

console.log(`\n✨ Sync complete! Fixed ${totalFixed} missing translations across all languages.`);
console.log(`📝 Note: Missing translations were filled with English text as fallback.`);
