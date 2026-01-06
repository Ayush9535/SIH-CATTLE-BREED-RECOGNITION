/**
 * Add numbered section titles to Hindi register translations
 * The screenshots show "1. Animal Identity & Traits", "2. Age, Sex, Breeding", etc.
 */

const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'locales', 'hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Update section titles to include numbers
hiData.register.sections = {
    identity: "1. पशु पहचान और लक्षण",
    age: "2. उम्र, लिंग, प्रजनन",
    health: "3. स्वास्थ्य और उत्पादन",
    owner: "4. मालिक और स्थान"
};

// Add "Cattle" translation
if (!hiData.register.species) {
    hiData.register.species = {};
}
hiData.register.species.cattle = "पशु";
hiData.register.species.buffalo = "भैंस";

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n', 'utf8');

console.log('✅ Updated Hindi register section titles with numbers!');
console.log('✅ Added species translations!');

// Do the same for Gujarati
const guPath = path.join(__dirname, 'locales', 'gu.json');
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));

guData.register.sections = {
    identity: "1. પશુ ઓળખ અને લક્ષણો",
    age: "2. ઉંમર, લિંગ, સંવર્ધન",
    health: "3. આરોગ્ય અને ઉત્પાદન",
    owner: "4. માલિક અને સ્થાન"
};

if (!guData.register.species) {
    guData.register.species = {};
}
guData.register.species.cattle = "પશુ";
guData.register.species.buffalo = "ભેંસ";

fs.writeFileSync(guPath, JSON.stringify(guData, null, 2) + '\n', 'utf8');

console.log('✅ Updated Gujarati register section titles with numbers!');
console.log('✅ Added species translations!');
