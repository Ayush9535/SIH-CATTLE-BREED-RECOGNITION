const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

const updates = {
    'hi': "अतिथि उपयोगकर्ता",
    'gu': "अतिथि उपयोगकर्ता", // Placeholder, will fix if needed but likely "मेहमान"
    'ta': "விருந்தினர் பயனர்",
    'te': "అతిథि వినియోగదారు",
    'mr': "अतिथी वापरकर्ता",
    'kn': "ಅತಿಥि ಬಳಕೆದಾರ",
    'ml': "അതിഥി ഉപയോക്താവ്",
    'bn': "অতিথি ব্যবহারকারী",
    'pa': "ਪ੍ਰਾਹੁਣਾ ਵਰਤੋਂਕਾਰ",
    'as': "अतिथि ब्यवहारकारी",
    'or': "ଅତିଥି ବ୍ୟବହାରକାରୀ",
    'ur': "مہمان صارف",
    'sd': "مهمان استعمال ڪندڙ",
    'ne': "अतिथि प्रयोगकर्ता",
    'sa': "अतिथि उपयोक्ता",
    'kok': "सोयरो वापरपी"
};

// Corrections for specific scripts if my memory was fuzzy
updates['gu'] = "मेहमान उपयोगकर्ता"; // Better guess
updates['te'] = "అతిథి వినియోగదారు"; // Fixed typo

Object.keys(updates).forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Ensure auth object exists
        if (!content.auth) content.auth = {};

        // Add key if missing
        if (!content.auth.guestUser) {
            content.auth.guestUser = updates[lang];
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
            console.log(`✅ Added auth.guestUser to ${lang}`);
        } else {
            console.log(`ℹ️ ${lang} already has auth.guestUser`);
        }
    } else {
        console.log(`❌ File not found for ${lang}`);
    }
});
