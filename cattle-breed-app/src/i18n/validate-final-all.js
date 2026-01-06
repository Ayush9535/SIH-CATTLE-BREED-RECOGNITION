const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const languages = [
    'hi', 'gu', 'ta', 'te', 'mr', 'kn', 'ml', 'bn', 'pa', 'as', 'or',
    'ur', 'sd', 'ks', 'ne', 'sa', 'kok', 'mai', 'sat', 'doi', 'mni', 'brx', 'bo'
];

function countKeys(obj) {
    let count = 0;
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            count += countKeys(obj[k]);
        } else {
            count++;
        }
    }
    return count;
}

console.log('Final Validation Report:');
console.log('------------------------');

let allPass = true;

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const keys = countKeys(content);
            if (keys === 386) {
                console.log(`✅ ${lang}: ${keys} keys (PASS)`);
            } else {
                console.log(`❌ ${lang}: ${keys} keys (FAIL - Expected 386)`);
                allPass = false;
            }
        } catch (e) {
            console.log(`❌ ${lang}: Error reading/parsing file`);
            allPass = false;
        }
    } else {
        console.log(`❌ ${lang}: File not found`);
        allPass = false;
    }
});

console.log('------------------------');
if (allPass) {
    console.log('🎉 All 23 languages passed validation!');
} else {
    console.log('⚠️ Some languages failed validation.');
}
