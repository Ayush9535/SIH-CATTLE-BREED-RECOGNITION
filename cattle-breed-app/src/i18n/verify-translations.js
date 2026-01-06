#!/usr/bin/env node

/**
 * Translation Verification Script
 * Checks if all language files have consistent structure
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const enPath = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

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

const enKeys = getAllKeys(enData);
const langFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

console.log('\n🔍 Translation Verification Report\n');
console.log(`📋 English keys: ${enKeys.length}\n`);

let allComplete = true;

langFiles.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const langKeys = getAllKeys(data);
  
  const isComplete = langKeys.length === enKeys.length;
  const status = isComplete ? '✅' : '❌';
  
  console.log(`${status} ${lang.padEnd(5)} - ${langKeys.length}/${enKeys.length} keys`);
  
  if (!isComplete) {
    allComplete = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allComplete) {
  console.log('✨ All language files are complete!\n');
} else {
  console.log('⚠️  Some language files need attention.\n');
  console.log('Run: node complete-all-translations.js\n');
}
