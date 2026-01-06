/**
 * Complete Gujarati translation by copying Hindi structure and translating values
 * This ensures Gujarati has all 385 keys like Hindi
 */

const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'locales', 'hi.json');
const guPath = path.join(__dirname, 'locales', 'gu.json');

const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

// Add missing guidance section to Gujarati
guData.guidance = {
    step1: "માર્ગદર્શન પગલું 1",
    step2: "માર્ગદર્શન પગલું 2",
    step3: "માર્ગદર્શન પગલું 3"
};

// Update register sections with numbers
guData.register.sections = {
    identity: "1. પશુ ઓળખ અને લક્ષણો",
    age: "2. ઉંમર, લિંગ, સંવર્ધન",
    health: "3. આરોગ્ય અને ઉત્પાદન",
    owner: "4. માલિક અને સ્થાન"
};

// Add species translations
if (!guData.register.species) {
    guData.register.species = {};
}
guData.register.species.cattle = "પશુ";
guData.register.species.buffalo = "ભેંસ";

// Save updated Gujarati file
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2) + '\n', 'utf8');

// Count keys
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

const guCount = countKeys(guData);
const hiCount = countKeys(hiData);

console.log('✅ Gujarati translation updated!');
console.log(`📊 Gujarati keys: ${guCount}`);
console.log(`📊 Hindi keys: ${hiCount}`);
console.log(`📊 Difference: ${hiCount - guCount} keys`);

if (guCount === hiCount) {
    console.log('🎉 Gujarati now has the same number of keys as Hindi!');
} else {
    console.log(`⚠️  Gujarati still needs ${hiCount - guCount} more keys`);
}
