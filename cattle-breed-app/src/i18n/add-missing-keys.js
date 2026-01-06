/**
 * Script to add missing translation keys to all locale files
 * This ensures 100% translation coverage across all 23 languages
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

// New keys to add to uploadExt section
const newUploadExtKeys = {
    failedToAnalyze: "Failed to analyze image",
    offlineCharacteristic1: "Physical characteristics identified by AI model",
    offlineCharacteristic2: "Breed-specific features detected",
    offlineCareTip1: "Provide clean water daily",
    offlineCareTip2: "Feed balanced diet with minerals",
    offlineCareTip3: "Regular veterinary checkups",
    detectedWithConfidence: "Detected with {{confidence}}% confidence."
};

// Language-specific translations
const translations = {
    hi: {
        failedToAnalyze: "छवि का विश्लेषण करने में विफल",
        offlineCharacteristic1: "AI मॉडल द्वारा पहचानी गई शारीरिक विशेषताएं",
        offlineCharacteristic2: "नस्ल-विशिष्ट विशेषताएं पहचानी गईं",
        offlineCareTip1: "रोजाना साफ पानी प्रदान करें",
        offlineCareTip2: "खनिजों के साथ संतुलित आहार दें",
        offlineCareTip3: "नियमित पशु चिकित्सा जांच",
        detectedWithConfidence: "{{confidence}}% आत्मविश्वास के साथ पहचाना गया।"
    },
    mr: {
        failedToAnalyze: "प्रतिमा विश्लेषण अयशस्वी",
        offlineCharacteristic1: "AI मॉडेलद्वारे ओळखली गेलेली शारीरिक वैशिष्ट्ये",
        offlineCharacteristic2: "जाती-विशिष्ट वैशिष्ट्ये आढळली",
        offlineCareTip1: "दररोज स्वच्छ पाणी द्या",
        offlineCareTip2: "खनिजांसह संतुलित आहार द्या",
        offlineCareTip3: "नियमित पशुवैद्यकीय तपासणी",
        detectedWithConfidence: "{{confidence}}% आत्मविश्वासासह ओळखले."
    },
    ta: {
        failedToAnalyze: "படத்தை பகுப்பாய்வு செய்ய தோல்வி",
        offlineCharacteristic1: "AI மாதிரியால் அடையாளம் காணப்பட்ட உடல் பண்புகள்",
        offlineCharacteristic2: "இன-குறிப்பிட்ட அம்சங்கள் கண்டறியப்பட்டன",
        offlineCareTip1: "தினமும் சுத்தமான தண்ணீர் வழங்கவும்",
        offlineCareTip2: "தாதுக்களுடன் சமச்சீர் உணவு அளிக்கவும்",
        offlineCareTip3: "வழக்கமான கால்நடை மருத்துவ பரிசோதனைகள்",
        detectedWithConfidence: "{{confidence}}% நம்பிக்கையுடன் கண்டறியப்பட்டது."
    },
    te: {
        failedToAnalyze: "చిత్రాన్ని విశ్లేషించడంలో విఫలమైంది",
        offlineCharacteristic1: "AI మోడల్ ద్వారా గుర్తించబడిన శారీరక లక్షణాలు",
        offlineCharacteristic2: "జాతి-నిర్దిష్ట లక్షణాలు గుర్తించబడ్డాయి",
        offlineCareTip1: "ప్రతిరోజూ శుభ్రమైన నీరు అందించండి",
        offlineCareTip2: "ఖనిజాలతో సమతుల్య ఆహారం ఇవ్వండి",
        offlineCareTip3: "క్రమం తప్పకుండా పశువైద్య తనిఖీలు",
        detectedWithConfidence: "{{confidence}}% విశ్వాసంతో గుర్తించబడింది."
    },
    gu: {
        failedToAnalyze: "છબીનું વિશ્લેષણ કરવામાં નિષ્ફળ",
        offlineCharacteristic1: "AI મોડેલ દ્વારા ઓળખાયેલ શારીરિક લક્ષણો",
        offlineCharacteristic2: "જાતિ-વિશિષ્ટ લક્ષણો શોધાયા",
        offlineCareTip1: "દરરોજ સ્વચ્છ પાણી પૂરું પાડો",
        offlineCareTip2: "ખનિજો સાથે સંતુલિત આહાર આપો",
        offlineCareTip3: "નિયમિત પશુચિકિત્સા તપાસ",
        detectedWithConfidence: "{{confidence}}% વિશ્વાસ સાથે ઓળખાયું."
    },
    kn: {
        failedToAnalyze: "ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ವಿಫಲವಾಗಿದೆ",
        offlineCharacteristic1: "AI ಮಾದರಿಯಿಂದ ಗುರುತಿಸಲಾದ ಭೌತಿಕ ಗುಣಲಕ್ಷಣಗಳು",
        offlineCharacteristic2: "ತಳಿ-ನಿರ್ದಿಷ್ಟ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ",
        offlineCareTip1: "ಪ್ರತಿದಿನ ಶುದ್ಧ ನೀರು ಒದಗಿಸಿ",
        offlineCareTip2: "ಖನಿಜಗಳೊಂದಿಗೆ ಸಮತೋಲಿತ ಆಹಾರ ನೀಡಿ",
        offlineCareTip3: "ನಿಯಮಿತ ಪಶುವೈದ್ಯಕೀಯ ತಪಾಸಣೆಗಳು",
        detectedWithConfidence: "{{confidence}}% ವಿಶ್ವಾಸದೊಂದಿಗೆ ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ."
    },
    ml: {
        failedToAnalyze: "ചിത്രം വിശകലനം ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
        offlineCharacteristic1: "AI മോഡൽ തിരിച്ചറിഞ്ഞ ശാരീരിക സവിശേഷതകൾ",
        offlineCharacteristic2: "ഇനം-നിർദ്ദിഷ്ട സവിശേഷതകൾ കണ്ടെത്തി",
        offlineCareTip1: "ദിവസവും ശുദ്ധജലം നൽകുക",
        offlineCareTip2: "ധാതുക്കളോടുകൂടിയ സമതുലിത ഭക്ഷണം നൽകുക",
        offlineCareTip3: "പതിവ് മൃഗഡോക്ടർ പരിശോധനകൾ",
        detectedWithConfidence: "{{confidence}}% വിശ്വാസത്തോടെ കണ്ടെത്തി."
    },
    pa: {
        failedToAnalyze: "ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",
        offlineCharacteristic1: "AI ਮਾਡਲ ਦੁਆਰਾ ਪਛਾਣੀਆਂ ਗਈਆਂ ਸਰੀਰਕ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
        offlineCharacteristic2: "ਨਸਲ-ਵਿਸ਼ੇਸ਼ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਖੋਜੀਆਂ ਗਈਆਂ",
        offlineCareTip1: "ਰੋਜ਼ਾਨਾ ਸਾਫ਼ ਪਾਣੀ ਪ੍ਰਦਾਨ ਕਰੋ",
        offlineCareTip2: "ਖਣਿਜਾਂ ਨਾਲ ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਦਿਓ",
        offlineCareTip3: "ਨਿਯਮਤ ਪਸ਼ੂ ਡਾਕਟਰੀ ਜਾਂਚ",
        detectedWithConfidence: "{{confidence}}% ਵਿਸ਼ਵਾਸ ਨਾਲ ਪਛਾਣਿਆ ਗਿਆ।"
    },
    ur: {
        failedToAnalyze: "تصویر کا تجزیہ کرنے میں ناکام",
        offlineCharacteristic1: "AI ماڈل کے ذریعہ شناخت شدہ جسمانی خصوصیات",
        offlineCharacteristic2: "نسل کی مخصوص خصوصیات کا پتہ چلا",
        offlineCareTip1: "روزانہ صاف پانی فراہم کریں",
        offlineCareTip2: "معدنیات کے ساتھ متوازن خوراک دیں",
        offlineCareTip3: "باقاعدہ ویٹرنری چیک اپ",
        detectedWithConfidence: "{{confidence}}% اعتماد کے ساتھ شناخت کیا گیا۔"
    },
    bn: {
        failedToAnalyze: "ছবি বিশ্লেষণ করতে ব্যর্থ",
        offlineCharacteristic1: "AI মডেল দ্বারা চিহ্নিত শারীরিক বৈশিষ্ট্য",
        offlineCharacteristic2: "জাত-নির্দিষ্ট বৈশিষ্ট্য সনাক্ত করা হয়েছে",
        offlineCareTip1: "প্রতিদিন পরিষ্কার জল সরবরাহ করুন",
        offlineCareTip2: "খনিজ সহ সুষম খাদ্য খাওয়ান",
        offlineCareTip3: "নিয়মিত পশুচিকিৎসা পরীক্ষা",
        detectedWithConfidence: "{{confidence}}% আত্মবিশ্বাসের সাথে সনাক্ত করা হয়েছে।"
    },
    or: {
        failedToAnalyze: "ଚିତ୍ର ବିଶ୍ଳେଷଣ କରିବାରେ ବିଫଳ",
        offlineCharacteristic1: "AI ମଡେଲ ଦ୍ୱାରା ଚିହ୍ନଟ ହୋଇଥିବା ଶାରୀରିକ ବିଶେଷତା",
        offlineCharacteristic2: "ପ୍ରଜାତି-ନିର୍ଦ୍ଦିଷ୍ଟ ବିଶେଷତା ଚିହ୍ନଟ ହୋଇଛି",
        offlineCareTip1: "ପ୍ରତିଦିନ ପରିଷ୍କାର ଜଳ ଯୋଗାଇ ଦିଅନ୍ତୁ",
        offlineCareTip2: "ଖଣିଜ ସହିତ ସନ୍ତୁଳିତ ଖାଦ୍ୟ ଦିଅନ୍ତୁ",
        offlineCareTip3: "ନିୟମିତ ପଶୁ ଚିକିତ୍ସା ପରୀକ୍ଷା",
        detectedWithConfidence: "{{confidence}}% ଆତ୍ମବିଶ୍ୱାସ ସହିତ ଚିହ୍ନଟ ହୋଇଛି।"
    },
    as: {
        failedToAnalyze: "ছবি বিশ্লেষণ কৰিবলৈ ব্যৰ্থ",
        offlineCharacteristic1: "AI মডেলৰ দ্বাৰা চিনাক্ত কৰা শাৰীৰিক বৈশিষ্ট্য",
        offlineCharacteristic2: "জাত-নিৰ্দিষ্ট বৈশিষ্ট্য চিনাক্ত কৰা হৈছে",
        offlineCareTip1: "প্ৰতিদিনে পৰিষ্কাৰ পানী যোগান ধৰক",
        offlineCareTip2: "খনিজৰ সৈতে সন্তুলিত আহাৰ খুৱাওক",
        offlineCareTip3: "নিয়মীয়া পশু চিকিৎসা পৰীক্ষা",
        detectedWithConfidence: "{{confidence}}% আত্মবিশ্বাসৰ সৈতে চিনাক্ত কৰা হৈছে।"
    },
    ne: {
        failedToAnalyze: "छवि विश्लेषण गर्न असफल",
        offlineCharacteristic1: "AI मोडेलद्वारा पहिचान गरिएका शारीरिक विशेषताहरू",
        offlineCharacteristic2: "नस्ल-विशिष्ट विशेषताहरू पत्ता लगाइयो",
        offlineCareTip1: "दैनिक सफा पानी प्रदान गर्नुहोस्",
        offlineCareTip2: "खनिजहरूसँग सन्तुलित आहार खुवाउनुहोस्",
        offlineCareTip3: "नियमित पशु चिकित्सा जाँच",
        detectedWithConfidence: "{{confidence}}% विश्वासका साथ पहिचान गरियो।"
    },
    sd: {
        failedToAnalyze: "تصوير جو تجزيو ڪرڻ ۾ ناڪام",
        offlineCharacteristic1: "AI ماڊل پاران سڃاڻپ ٿيل جسماني خاصيتون",
        offlineCharacteristic2: "نسل جي مخصوص خاصيتون معلوم ٿيون",
        offlineCareTip1: "روزانو صاف پاڻي فراهم ڪريو",
        offlineCareTip2: "معدنيات سان متوازن غذا ڏيو",
        offlineCareTip3: "باقاعده جانورن جي طبي چڪاس",
        detectedWithConfidence: "{{confidence}}% اعتماد سان سڃاڻپ ڪيو ويو۔"
    },
    // For languages without native translations, use English
    mai: newUploadExtKeys,
    sa: newUploadExtKeys,
    ks: newUploadExtKeys,
    kok: newUploadExtKeys,
    doi: newUploadExtKeys,
    mni: newUploadExtKeys,
    sat: newUploadExtKeys,
    bo: newUploadExtKeys
};

// Get all locale files
const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log(`Found ${localeFiles.length} locale files`);

localeFiles.forEach(file => {
    const filePath = path.join(localesDir, file);
    const langCode = file.replace('.json', '');

    try {
        // Read the file
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        // Check if uploadExt section exists
        if (!data.uploadExt) {
            console.warn(`Warning: ${file} missing uploadExt section`);
            return;
        }

        // Get translations for this language or use English
        const langTranslations = translations[langCode] || newUploadExtKeys;

        // Add missing keys
        let updated = false;
        Object.keys(langTranslations).forEach(key => {
            if (!data.uploadExt[key]) {
                data.uploadExt[key] = langTranslations[key];
                updated = true;
            }
        });

        if (updated) {
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\r\n', 'utf8');
            console.log(`✅ Updated ${file}`);
        } else {
            console.log(`✓ ${file} already up to date`);
        }

    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
});

console.log('\n✨ Translation update complete!');
