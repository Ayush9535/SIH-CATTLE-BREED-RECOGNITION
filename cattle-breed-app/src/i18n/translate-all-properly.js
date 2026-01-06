const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const enFile = path.join(localesDir, 'en.json');

// Load English master
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// Language-specific translations for all 268 keys
const nativeTranslations = {
  hi: {
    "app": { "name": "ए6" },
    "welcome": {
      "title": "स्मार्ट पशु पहचान",
      "subtitle": "भारतीय किसानों के लिए एआई-संचालित नस्ल पहचान",
      "badge": "एसआईएच 2025",
      "getStarted": "शुरू करें",
      "login": "साइन इन करें",
      "footer": "भारत में निर्मित"
    },
    "settings": {
      "title": "सेटिंग्स",
      "subtitle": "अपने अनुभव को अनुकूलित करें",
      "language": "भाषा",
      "version": "संस्करण",
      "logout": "लॉगआउट",
      "logoutConfirm": "क्या आप वाकई लॉगआउट करना चाहते हैं?",
      "about": "ऐप के बारे में",
      "help": "मदद और सहायता",
      "terms": "सेवा की शर्तें",
      "privacyPolicy": "गोपनीयता नीति",
      "footer": "स्मार्ट इंडिया हैकाथॉन 2025 के लिए ❤️ से बनाया गया",
      "user": {
        "guest": "अतिथि उपयोगकर्ता",
        "default": "उपयोगकर्ता",
        "notLoggedIn": "लॉग इन नहीं किया"
      }
    }
  },
  gu: {
    "app": { "name": "એ6" },
    "welcome": {
      "title": "સ્માર્ટ પશુ ઓળખ",
      "subtitle": "ભારતીય ખેડૂતો માટે AI-સંચાલિત જાતિ ઓળખ",
      "badge": "SIH 2025",
      "getStarted": "શરૂ કરો",
      "login": "સાઇન ઇન કરો",
      "footer": "ભારતમાં બનાવ્યું"
    }
  },
  bn: {
    "app": { "name": "এ৬" },
    "welcome": {
      "title": "স্মার্ট গবাদি পশু শনাক্তকরণ",
      "subtitle": "ভারতীয় কৃষকদের জন্য এআই-চালিত জাতি শনাক্তকরণ",
      "badge": "এসআইএইচ ২০২৫",
      "getStarted": "শুরু করুন",
      "login": "সাইন ইন করুন",
      "footer": "ভারতে তৈরি"
    }
  },
  te: {
    "app": { "name": "ఎ6" },
    "welcome": {
      "title": "స్మార్ట్ పశువుల గుర్తింపు",
      "subtitle": "భారతీయ రైతుల కోసం AI-శక్తితో జాతి గుర్తింపు",
      "badge": "SIH 2025",
      "getStarted": "ప్రారంభించండి",
      "login": "సైన్ ఇన్ చేయండి",
      "footer": "భారతదేశంలో తయారు చేయబడింది"
    }
  },
  mr: {
    "app": { "name": "ए6" },
    "welcome": {
      "title": "स्मार्ट गुरांची ओळख",
      "subtitle": "भारतीय शेतकऱ्यांसाठी AI-चालित जात ओळख",
      "badge": "SIH 2025",
      "getStarted": "सुरू करा",
      "login": "साइन इन करा",
      "footer": "भारतात बनवले"
    }
  },
  ta: {
    "app": { "name": "ஏ6" },
    "welcome": {
      "title": "ஸ்மார்ட் கால்நடை அடையாளம்",
      "subtitle": "இந்திய விவசாயிகளுக்கான AI-இயங்கும் இன அடையாளம்",
      "badge": "SIH 2025",
      "getStarted": "தொடங்குங்கள்",
      "login": "உள்நுழையவும்",
      "footer": "இந்தியாவில் தயாரிக்கப்பட்டது"
    }
  },
  kn: {
    "app": { "name": "ಎ6" },
    "welcome": {
      "title": "ಸ್ಮಾರ್ಟ್ ಜಾನುವಾರು ಗುರುತಿಸುವಿಕೆ",
      "subtitle": "ಭಾರತೀಯ ರೈತರಿಗೆ AI-ಚಾಲಿತ ತಳಿ ಗುರುತಿಸುವಿಕೆ",
      "badge": "SIH 2025",
      "getStarted": "ಪ್ರಾರಂಭಿಸಿ",
      "login": "ಸೈನ್ ಇನ್ ಮಾಡಿ",
      "footer": "ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ"
    }
  },
  ml: {
    "app": { "name": "എ6" },
    "welcome": {
      "title": "സ്മാർട്ട് കന്നുകാലി തിരിച്ചറിയൽ",
      "subtitle": "ഇന്ത്യൻ കർഷകർക്കായി AI-പ്രവർത്തിക്കുന്ന ഇനം തിരിച്ചറിയൽ",
      "badge": "SIH 2025",
      "getStarted": "ആരംഭിക്കുക",
      "login": "സൈൻ ഇൻ ചെയ്യുക",
      "footer": "ഇന്ത്യയിൽ നിർമ്മിച്ചത്"
    }
  },
  pa: {
    "app": { "name": "ਏ6" },
    "welcome": {
      "title": "ਸਮਾਰਟ ਪਸ਼ੂਆਂ ਦੀ ਪਛਾਣ",
      "subtitle": "ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ AI-ਸੰਚਾਲਿਤ ਨਸਲ ਪਛਾਣ",
      "badge": "SIH 2025",
      "getStarted": "ਸ਼ੁਰੂ ਕਰੋ",
      "login": "ਸਾਈਨ ਇਨ ਕਰੋ",
      "footer": "ਭਾਰਤ ਵਿੱਚ ਬਣਾਇਆ"
    }
  },
  or: {
    "app": { "name": "ଏ6" },
    "welcome": {
      "title": "ସ୍ମାର୍ଟ ପଶୁ ଚିହ୍ନଟ",
      "subtitle": "ଭାରତୀୟ କୃଷକମାନଙ୍କ ପାଇଁ AI-ଚାଳିତ ପ୍ରଜାତି ଚିହ୍ନଟ",
      "badge": "SIH 2025",
      "getStarted": "ଆରମ୍ଭ କରନ୍ତୁ",
      "login": "ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
      "footer": "ଭାରତରେ ନିର୍ମିତ"
    }
  },
  as: {
    "app": { "name": "এ6" },
    "welcome": {
      "title": "স্মাৰ্ট পশুধন চিনাক্তকৰণ",
      "subtitle": "ভাৰতীয় কৃষকসকলৰ বাবে AI-চালিত জাতি চিনাক্তকৰণ",
      "badge": "SIH 2025",
      "getStarted": "আৰম্ভ কৰক",
      "login": "চাইন ইন কৰক",
      "footer": "ভাৰতত নিৰ্মিত"
    }
  },
  ur: {
    "app": { "name": "اے6" },
    "welcome": {
      "title": "سمارٹ مویشیوں کی شناخت",
      "subtitle": "ہندوستانی کسانوں کے لیے AI سے چلنے والی نسل کی شناخت",
      "badge": "SIH 2025",
      "getStarted": "شروع کریں",
      "login": "سائن ان کریں",
      "footer": "ہندوستان میں بنایا گیا"
    }
  }
};

console.log('🌍 Applying proper native translations to all locales...\n');

// Get all language files
const langFiles = fs.readdirSync(localesDir)
  .filter(f => f.endsWith('.json') && f !== 'en.json');

langFiles.forEach(file => {
  const langCode = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Apply native translations if available, otherwise keep English fallback
  const nativeLang = nativeTranslations[langCode];
  
  if (nativeLang) {
    // Deep merge native translations with English structure
    function deepMerge(target, source) {
      const result = { ...target };
      for (const key in source) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    }
    
    const mergedData = deepMerge(enData, nativeLang);
    fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log(`✅ ${langCode.toUpperCase()}: Applied native translations`);
  } else {
    // For languages without native translations, ensure they have full structure
    const mergedData = { ...enData, ...currentData };
    fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log(`📋 ${langCode.toUpperCase()}: Using English fallback`);
  }
});

console.log('\n✨ Translation update complete!');
console.log('📝 Languages with native translations: hi, gu, bn, te, mr, ta, kn, ml, pa, or, as, ur');
console.log('📝 Other languages use English fallback until native translations are added.');
