/**
 * Add guidance step translations to Hindi and English files
 */

const fs = require('fs');
const path = require('path');

// Add to English
const enPath = path.join(__dirname, 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

enData.guidance = {
    step1: "GUIDANCE STEP 1",
    step2: "GUIDANCE STEP 2",
    step3: "GUIDANCE STEP 3"
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n', 'utf8');
console.log('✅ Added guidance steps to English');

// Add to Hindi
const hiPath = path.join(__dirname, 'locales', 'hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

hiData.guidance = {
    step1: "मार्गदर्शन चरण 1",
    step2: "मार्गदर्शन चरण 2",
    step3: "मार्गदर्शन चरण 3"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n', 'utf8');
console.log('✅ Added guidance steps to Hindi');

// Add to Gujarati
const guPath = path.join(__dirname, 'locales', 'gu.json');
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

guData.guidance = {
    step1: "માર્ગદર્શન પગલું 1",
    step2: "માર્ગદર્શન પગલું 2",
    step3: "માર્ગદર્શન પગલું 3"
};

fs.writeFileSync(guPath, JSON.stringify(guData, null, 2) + '\n', 'utf8');
console.log('✅ Added guidance steps to Gujarati');

console.log('\n🎉 Guidance steps added to all languages!');
