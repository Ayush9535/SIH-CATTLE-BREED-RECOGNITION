/**
 * Validate Gujarati Translation
 */

const fs = require('fs');
const path = require('path');

const guPath = path.join(__dirname, 'locales', 'gu.json');
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Function to find English strings recursively
function findEnglishStrings(obj, prefix = '') {
    const englishStrings = [];

    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            englishStrings.push(...findEnglishStrings(value, fullKey));
        } else if (typeof value === 'string') {
            // Check if string contains English characters (basic check)
            if (/^[A-Za-z\s\-\.,!?'"%&()]+$/.test(value) && value.length > 2) {
                englishStrings.push({ key: fullKey, value });
            }
        }
    }

    return englishStrings;
}

console.log('🔍 Validating Gujarati Translation File...\n');

const englishStrings = findEnglishStrings(guData);

if (englishStrings.length === 0) {
    console.log('✅ SUCCESS! No English strings found!');
    console.log('🎉 Gujarati translation is 100% complete!\n');
    console.log('📊 Statistics:');

    // Count total keys
    function countKeys(obj) {
        let count = 0;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                count += countKeys(obj[key]);
            } else {
                count++;
            }
        }
        return count;
    }

    const totalKeys = countKeys(guData);
    console.log(`   Total Translation Keys: ${totalKeys}`);
    console.log(`   English Strings: 0`);
    console.log(`   Coverage: 100% ✅\n`);

} else {
    console.log(`⚠️  Found ${englishStrings.length} English strings:\n`);
    englishStrings.forEach(({ key, value }) => {
        console.log(`   ${key}: "${value}"`);
    });
    console.log('\n');
}
