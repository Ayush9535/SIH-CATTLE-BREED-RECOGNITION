/**
 * Complete fix for Hindi chatbot - Add buffalo breeds and update chatbot code
 */

const fs = require('fs');
const path = require('path');

// Step 1: Update Hindi translation file with buffalo breeds
const hiPath = path.join(__dirname, 'locales', 'hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Add buffalo breeds
hiData.breeds.murrah = "मुर्रा";
hiData.breeds.jaffarabadi = "जाफराबादी";
hiData.breeds.surti = "सूरती";
hiData.breeds.niliRavi = "नीली रावी";
hiData.breeds.pandharpuri = "पंढरपुरी";

// Save updated Hindi file
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n', 'utf8');
console.log('✅ Added buffalo breeds to Hindi translation');

// Step 2: Update chatbot.tsx to use translated breed names
const chatbotPath = path.join(__dirname, '..', '..', 'app', '(tabs)', 'chatbot.tsx');
let chatbotCode = fs.readFileSync(chatbotPath, 'utf8');

// Find and replace the handleCategorySelect function
const oldCode = `    // Get breed names from the data
    const breedNames = Object.keys(breedData[categoryKey]);

    // Bot asks which breed
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: t('chatbotExt.greatWhich', { category: categoryName.toLowerCase() }),
      sender: 'bot',
      options: breedNames,
      onOptionClick: (breedName) => handleBreedSelect(categoryKey, breedName),
    };`;

const newCode = `    // Get breed names from the data and translate them
    const breedKeys = Object.keys(breedData[categoryKey]);
    
    // Map English breed names to translation keys
    const breedNameMap: { [key: string]: string } = {
      'Gir': 'breeds.gir',
      'Sahiwal': 'breeds.sahiwal',
      'Red Sindhi': 'breeds.redSindhi',
      'Tharparkar': 'breeds.tharparkar',
      'Kankrej': 'breeds.kankrej',
      'Murrah': 'breeds.murrah',
      'Jaffarabadi': 'breeds.jaffarabadi',
      'Surti': 'breeds.surti',
      'Nili Ravi': 'breeds.niliRavi',
      'Pandharpuri': 'breeds.pandharpuri'
    };
    
    // Get translated breed names
    const translatedBreedNames = breedKeys.map(key => {
      const translationKey = breedNameMap[key];
      return translationKey ? t(translationKey) : key;
    });

    // Bot asks which breed
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: t('chatbotExt.greatWhich', { category: categoryName.toLowerCase() }),
      sender: 'bot',
      options: translatedBreedNames,
      onOptionClick: (translatedBreedName) => {
        // Find the original English key for the selected translated name
        const breedIndex = translatedBreedNames.indexOf(translatedBreedName);
        const originalBreedKey = breedKeys[breedIndex];
        handleBreedSelect(categoryKey, originalBreedKey, translatedBreedName);
      },
    };`;

chatbotCode = chatbotCode.replace(oldCode, newCode);

// Update handleBreedSelect signature
chatbotCode = chatbotCode.replace(
    'const handleBreedSelect = (categoryKey: string, breedName: string) => {',
    'const handleBreedSelect = (categoryKey: string, breedKey: string, displayName: string) => {'
);

// Update the breed variable line
chatbotCode = chatbotCode.replace(
    'const breed = breedData[categoryKey][breedName];',
    'const breed = breedData[categoryKey][breedKey];'
);

// Update the user message to use displayName
chatbotCode = chatbotCode.replace(
    /text: breedName,\s+sender: 'user',\s+};\s+\/\/ Bot asks what info they want/,
    `text: displayName,
      sender: 'user',
    };

    // Bot asks what info they want`
);

// Update the bot message that uses breedName
chatbotCode = chatbotCode.replace(
    /text: t\('chatbotExt\.whatAbout', { breed: breedName }\),/,
    `text: t('chatbotExt.whatAbout', { breed: displayName }),`
);

// Save updated chatbot file
fs.writeFileSync(chatbotPath, chatbotCode, 'utf8');
console.log('✅ Updated chatbot.tsx to use translated breed names');

console.log('\n🎉 Chatbot fix complete!');
console.log('Breed options will now appear in Hindi when Hindi is selected.');
