/**
 * FINAL SYNC: Ensure ALL languages have EXACTLY the same keys as hi.json (385 keys)
 * Uses hi.json as the master template for structure.
 * Fills missing keys with English values from en.json or placeholders.
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const hiPath = path.join(localesDir, 'hi.json');
const enPath = path.join(localesDir, 'en.json');

const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper to get value from object by dot notation path
function getValue(obj, pathArr) {
    return pathArr.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
}

// Helper to set value in object by dot notation path
function setValue(obj, pathArr, value) {
    let current = obj;
    for (let i = 0; i < pathArr.length - 1; i++) {
        const key = pathArr[i];
        if (!current[key]) current[key] = {};
        current = current[key];
    }
    current[pathArr[pathArr.length - 1]] = value;
}

// Recursive function to collect all keys
function getAllKeys(obj, prefix = []) {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], prefix.concat(key)));
        } else {
            keys.push(prefix.concat(key));
        }
    }
    return keys;
}

const allKeys = getAllKeys(hiData);
console.log(`Master (Hindi) has ${allKeys.length} keys.`);

// Get all json files
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(f => {
    if (f === 'hi.json') return; // Skip master

    const filePath = path.join(localesDir, f);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    allKeys.forEach(keyPath => {
        const existingVal = getValue(data, keyPath);
        if (existingVal === undefined) {
            // Key is missing!
            // Try to get from English first, then Hindi (as fallback)
            let fallbackVal = getValue(enData, keyPath);
            if (fallbackVal === undefined) fallbackVal = getValue(hiData, keyPath);

            // If it's a specific known key, we might have a better default
            const keyStr = keyPath.join('.');
            if (keyStr.includes('guidance.step')) fallbackVal = `Step ${keyPath[1].replace('step', '')}`;

            setValue(data, keyPath, fallbackVal);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Updated ${f} - added missing keys.`);
    } else {
        console.log(`✨ ${f} is already complete.`);
    }
});

console.log('🎉 Sync complete. All files should now have 385 keys.');
