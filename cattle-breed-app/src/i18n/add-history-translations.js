const fs = require('fs');
const path = require('path');

// History translations for all 23 languages
const historyTranslations = {
  en: {
    title: "History",
    scanHistory: "Scan History",
    predictions: "Predictions",
    registrations: "Registrations",
    noScans: "No scans yet",
    noScansDesc: "Your identification history will appear here",
    noRegistrations: "No registrations yet",
    noRegistrationsDesc: "Your cattle registrations will appear here",
    synced: "Synced",
    pendingSync: "Pending Sync",
    loginRequired: "Login Required",
    loginRequiredDesc: "Please login to track your scan history",
    loginNow: "Login Now"
  },
  hi: {
    title: "इतिहास",
    scanHistory: "स्कैन इतिहास",
    predictions: "पूर्वानुमान",
    registrations: "पंजीकरण",
    noScans: "अभी तक कोई स्कैन नहीं",
    noScansDesc: "आपका पहचान इतिहास यहां दिखाई देगा",
    noRegistrations: "अभी तक कोई पंजीकरण नहीं",
    noRegistrationsDesc: "आपके पशु पंजीकरण यहां दिखाई देंगे",
    synced: "सिंक हो गया",
    pendingSync: "सिंक लंबित",
    loginRequired: "लॉगिन आवश्यक",
    loginRequiredDesc: "अपने स्कैन इतिहास को ट्रैक करने के लिए कृपया लॉगिन करें",
    loginNow: "अभी लॉगिन करें"
  },
  gu: {
    title: "ઇતિહાસ",
    scanHistory: "સ્કેન ઇતિહાસ",
    predictions: "આગાહીઓ",
    registrations: "નોંધણીઓ",
    noScans: "હજુ સુધી કોઈ સ્કેન નથી",
    noScansDesc: "તમારો ઓળખ ઇતિહાસ અહીં દેખાશે",
    noRegistrations: "હજુ સુધી કોઈ નોંધણી નથી",
    noRegistrationsDesc: "તમારી પશુ નોંધણીઓ અહીં દેખાશે",
    synced: "સિંક થયું",
    pendingSync: "સિંક બાકી",
    loginRequired: "લૉગિન જરૂરી",
    loginRequiredDesc: "તમારા સ્કેન ઇતિહાસને ટ્રેક કરવા માટે કૃપા કરીને લૉગિન કરો",
    loginNow: "હવે લૉગિન કરો"
  },
  bn: {
    title: "ইতিহাস",
    scanHistory: "স্ক্যান ইতিহাস",
    predictions: "পূর্বাভাস",
    registrations: "নিবন্ধন",
    noScans: "এখনো কোন স্ক্যান নেই",
    noScansDesc: "আপনার সনাক্তকরণ ইতিহাস এখানে প্রদর্শিত হবে",
    noRegistrations: "এখনো কোন নিবন্ধন নেই",
    noRegistrationsDesc: "আপনার গবাদি পশু নিবন্ধন এখানে প্রদর্শিত হবে",
    synced: "সিঙ্ক হয়েছে",
    pendingSync: "সিঙ্ক মুলতুবি",
    loginRequired: "লগইন প্রয়োজন",
    loginRequiredDesc: "আপনার স্ক্যান ইতিহাস ট্র্যাক করতে দয়া করে লগইন করুন",
    loginNow: "এখনই লগইন"
  },
  te: {
    title: "చరిత్ర",
    scanHistory: "స్కాన్ చరిత్ర",
    predictions: "అంచనాలు",
    registrations: "నమోదులు",
    noScans: "ఇంకా స్కాన్‌లు లేవు",
    noScansDesc: "మీ గుర్తింపు చరిత్ర ఇక్కడ కనిపిస్తుంది",
    noRegistrations: "ఇంకా నమోదులు లేవు",
    noRegistrationsDesc: "మీ పశువుల నమోదులు ఇక్కడ కనిపిస్తాయి",
    synced: "సమకాలీకరించబడింది",
    pendingSync: "సమకాలీకరణ పెండింగ్",
    loginRequired: "లాగిన్ అవసరం",
    loginRequiredDesc: "మీ స్కాన్ చరిత్రను ట్రాక్ చేయడానికి దయచేసి లాగిన్ చేయండి",
    loginNow: "ఇప్పుడు లాగిన్ చేయండి"
  },
  mr: {
    title: "इतिहास",
    scanHistory: "स्कॅन इतिहास",
    predictions: "अंदाज",
    registrations: "नोंदणी",
    noScans: "अद्याप कोणतेही स्कॅन नाहीत",
    noScansDesc: "तुमचा ओळख इतिहास येथे दिसेल",
    noRegistrations: "अद्याप कोणत्याही नोंदणी नाहीत",
    noRegistrationsDesc: "तुमच्या गुरांच्या नोंदणी येथे दिसतील",
    synced: "सिंक झाले",
    pendingSync: "सिंक प्रलंबित",
    loginRequired: "लॉगिन आवश्यक",
    loginRequiredDesc: "तुमच्या स्कॅन इतिहासाचा मागोवा घेण्यासाठी कृपया लॉगिन करा",
    loginNow: "आता लॉगिन करा"
  },
  ta: {
    title: "வரலாறு",
    scanHistory: "ஸ்கேன் வரலாறு",
    predictions: "கணிப்புகள்",
    registrations: "பதிவுகள்",
    noScans: "இன்னும் ஸ்கேன்கள் இல்லை",
    noScansDesc: "உங்கள் அடையாள வரலாறு இங்கே தோன்றும்",
    noRegistrations: "இன்னும் பதிவுகள் இல்லை",
    noRegistrationsDesc: "உங்கள் கால்நடை பதிவுகள் இங்கே தோன்றும்",
    synced: "ஒத்திசைக்கப்பட்டது",
    pendingSync: "ஒத்திசைவு நிலுவையில்",
    loginRequired: "உள்நுழைவு தேவை",
    loginRequiredDesc: "உங்கள் ஸ்கேன் வரலாற்றைக் கண்காணிக்க தயவுசெய்து உள்நுழையவும்",
    loginNow: "இப்போது உள்நுழைக"
  },
  ur: {
    title: "تاریخ",
    scanHistory: "اسکین کی تاریخ",
    predictions: "پیشین گوئیاں",
    registrations: "رجسٹریشن",
    noScans: "ابھی تک کوئی اسکین نہیں",
    noScansDesc: "آپ کی شناخت کی تاریخ یہاں ظاہر ہوگی",
    noRegistrations: "ابھی تک کوئی رجسٹریشن نہیں",
    noRegistrationsDesc: "آپ کی مویشیوں کی رجسٹریشن یہاں ظاہر ہوں گی",
    synced: "ہم آہنگ",
    pendingSync: "ہم آہنگی زیر التواء",
    loginRequired: "لاگ ان ضروری",
    loginRequiredDesc: "اپنی اسکین کی تاریخ کو ٹریک کرنے کے لیے براہ کرم لاگ ان کریں",
    loginNow: "ابھی لاگ ان کریں"
  },
  kn: {
    title: "ಇತಿಹಾಸ",
    scanHistory: "ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸ",
    predictions: "ಮುನ್ಸೂಚನೆಗಳು",
    registrations: "ನೋಂದಣಿಗಳು",
    noScans: "ಇನ್ನೂ ಯಾವುದೇ ಸ್ಕ್ಯಾನ್‌ಗಳಿಲ್ಲ",
    noScansDesc: "ನಿಮ್ಮ ಗುರುತಿನ ಇತಿಹಾಸ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ",
    noRegistrations: "ಇನ್ನೂ ಯಾವುದೇ ನೋಂದಣಿಗಳಿಲ್ಲ",
    noRegistrationsDesc: "ನಿಮ್ಮ ಜಾನುವಾರು ನೋಂದಣಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ",
    synced: "ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ",
    pendingSync: "ಸಿಂಕ್ ಬಾಕಿ ಉಳಿದಿದೆ",
    loginRequired: "ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ",
    loginRequiredDesc: "ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ",
    loginNow: "ಈಗ ಲಾಗಿನ್ ಮಾಡಿ"
  },
  ml: {
    title: "ചരിത്രം",
    scanHistory: "സ്കാൻ ചരിത്രം",
    predictions: "പ്രവചനങ്ങൾ",
    registrations: "രജിസ്ട്രേഷനുകൾ",
    noScans: "ഇതുവരെ സ്കാനുകൾ ഇല്ല",
    noScansDesc: "നിങ്ങളുടെ ഐഡന്റിഫിക്കേഷൻ ചരിത്രം ഇവിടെ ദൃശ്യമാകും",
    noRegistrations: "ഇതുവരെ രജിസ്ട്രേഷനുകൾ ഇല്ല",
    noRegistrationsDesc: "നിങ്ങളുടെ കന്നുകാലി രജിസ്ട്രേഷനുകൾ ഇവിടെ ദൃശ്യമാകും",
    synced: "സമന്വയിപ്പിച്ചു",
    pendingSync: "സമന്വയം തീരുമാനം",
    loginRequired: "ലോഗിൻ ആവശ്യമാണ്",
    loginRequiredDesc: "നിങ്ങളുടെ സ്കാൻ ചരിത്രം ട്രാക്ക് ചെയ്യാൻ ദയവായി ലോഗിൻ ചെയ്യുക",
    loginNow: "ഇപ്പോൾ ലോഗിൻ ചെയ്യുക"
  },
  or: {
    title: "ଇତିହାସ",
    scanHistory: "ସ୍କାନ୍ ଇତିହାସ",
    predictions: "ପୂର୍ବାନୁମାନ",
    registrations: "ପଞ୍ଜୀକରଣ",
    noScans: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସ୍କାନ୍ ନାହିଁ",
    noScansDesc: "ଆପଣଙ୍କର ପରିଚୟ ଇତିହାସ ଏଠାରେ ଦେଖାଯିବ",
    noRegistrations: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ପଞ୍ଜୀକରଣ ନାହିଁ",
    noRegistrationsDesc: "ଆପଣଙ୍କର ପଶୁ ପଞ୍ଜୀକରଣ ଏଠାରେ ଦେଖାଯିବ",
    synced: "ସିଙ୍କ୍ ହୋଇଛି",
    pendingSync: "ସିଙ୍କ୍ ବିଚାରାଧୀନ",
    loginRequired: "ଲଗଇନ୍ ଆବଶ୍ୟକ",
    loginRequiredDesc: "ଆପଣଙ୍କର ସ୍କାନ୍ ଇତିହାସକୁ ଟ୍ରାକ୍ କରିବାକୁ ଦୟାକରି ଲଗଇନ୍ କରନ୍ତୁ",
    loginNow: "ବର୍ତ୍ତମାନ ଲଗଇନ୍ କରନ୍ତୁ"
  },
  pa: {
    title: "ਇਤਿਹਾਸ",
    scanHistory: "ਸਕੈਨ ਇਤਿਹਾਸ",
    predictions: "ਭਵਿੱਖਬਾਣੀਆਂ",
    registrations: "ਰਜਿਸਟ੍ਰੇਸ਼ਨਾਂ",
    noScans: "ਅਜੇ ਤੱਕ ਕੋਈ ਸਕੈਨ ਨਹੀਂ",
    noScansDesc: "ਤੁਹਾਡਾ ਪਛਾਣ ਇਤਿਹਾਸ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ",
    noRegistrations: "ਅਜੇ ਤੱਕ ਕੋਈ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨਹੀਂ",
    noRegistrationsDesc: "ਤੁਹਾਡੇ ਪਸ਼ੂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ",
    synced: "ਸਿੰਕ ਹੋ ਗਿਆ",
    pendingSync: "ਸਿੰਕ ਲੰਬਿਤ",
    loginRequired: "ਲਾਗਇਨ ਲੋੜੀਂਦਾ ਹੈ",
    loginRequiredDesc: "ਆਪਣੇ ਸਕੈਨ ਇਤਿਹਾਸ ਨੂੰ ਟ੍ਰੈਕ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਲਾਗਇਨ ਕਰੋ",
    loginNow: "ਹੁਣੇ ਲਾਗਇਨ ਕਰੋ"
  },
  as: {
    title: "ইতিহাস",
    scanHistory: "স্কেন ইতিহাস",
    predictions: "পূৰ্বাভাস",
    registrations: "পঞ্জীয়ন",
    noScans: "এতিয়ালৈকে কোনো স্কেন নাই",
    noScansDesc: "আপোনাৰ চিনাক্তকৰণ ইতিহাস ইয়াত দেখা যাব",
    noRegistrations: "এতিয়ালৈকে কোনো পঞ্জীয়ন নাই",
    noRegistrationsDesc: "আপোনাৰ গৰু-ম'হৰ পঞ্জীয়ন ইয়াত দেখা যাব",
    synced: "সংমিহলি হৈছে",
    pendingSync: "সংমিহলন বাকী",
    loginRequired: "লগইন প্ৰয়োজন",
    loginRequiredDesc: "আপোনাৰ স্কেন ইতিহাস ট্ৰেক কৰিবলৈ অনুগ্ৰহ কৰি লগইন কৰক",
    loginNow: "এতিয়াই লগইন কৰক"
  },
  mai: {
    title: "इतिहास",
    scanHistory: "स्कैन इतिहास",
    predictions: "भविष्यवाणी",
    registrations: "पंजीकरण",
    noScans: "अखन धरि कोनो स्कैन नहि",
    noScansDesc: "अहाँक पहचान इतिहास एतए देखाओल जायत",
    noRegistrations: "अखन धरि कोनो पंजीकरण नहि",
    noRegistrationsDesc: "अहाँक पशु पंजीकरण एतए देखाओल जायत",
    synced: "सिंक भ' गेल",
    pendingSync: "सिंक बाकी अछि",
    loginRequired: "लॉगिन आवश्यक",
    loginRequiredDesc: "अपन स्कैन इतिहास ट्रैक करबाक लेल कृपया लॉगिन करू",
    loginNow: "आब लॉगिन करू"
  },
  sa: {
    title: "इतिहासः",
    scanHistory: "स्कैन इतिहासः",
    predictions: "भविष्यवाणीः",
    registrations: "पञ्जीकरणम्",
    noScans: "अद्यावधि कोऽपि स्कैनः नास्ति",
    noScansDesc: "भवतः परिचय इतिहासः अत्र दृश्यते",
    noRegistrations: "अद्यावधि कोऽपि पञ्जीकरणं नास्ति",
    noRegistrationsDesc: "भवतः पशु पञ्जीकरणं अत्र दृश्यन्ते",
    synced: "समक्रमितम्",
    pendingSync: "समक्रमणं प्रतीक्ष्यते",
    loginRequired: "प्रवेशः आवश्यकः",
    loginRequiredDesc: "भवतः स्कैन इतिहासस्य अनुसरणाय कृपया प्रविशतु",
    loginNow: "साम्प्रतं प्रविशतु"
  },
  ks: {
    title: "تٲریٖخ",
    scanHistory: "سکین تٲریٖخ",
    predictions: "پیش بینی",
    registrations: "رجسٹریشن",
    noScans: "ابے تام کانہہ سکین نہٕ",
    noScansDesc: "تۄہُند شناخت تٲریٖخ یتنؠ ظٲہر گژھ",
    noRegistrations: "ابے تام کانہہ رجسٹریشن نہٕ",
    noRegistrationsDesc: "تۄہُند مویشی رجسٹریشن یتنؠ ظٲہر گژھن",
    synced: "ہم آہنگ",
    pendingSync: "ہم آہنگی باقی",
    loginRequired: "لاگ ان ضروری",
    loginRequiredDesc: "پننؠ سکین تٲریٖخ ٹریک کرنہٕ باپت مہربأنی کٔرتھ لاگ ان کٔرو",
    loginNow: "وۄنہ لاگ ان کٔرو"
  },
  ne: {
    title: "इतिहास",
    scanHistory: "स्क्यान इतिहास",
    predictions: "भविष्यवाणीहरू",
    registrations: "दर्ताहरू",
    noScans: "अहिलेसम्म कुनै स्क्यान छैन",
    noScansDesc: "तपाईंको पहिचान इतिहास यहाँ देखिनेछ",
    noRegistrations: "अहिलेसम्म कुनै दर्ता छैन",
    noRegistrationsDesc: "तपाईंको गाईवस्तु दर्ताहरू यहाँ देखिनेछन्",
    synced: "सिंक भयो",
    pendingSync: "सिंक बाँकी",
    loginRequired: "लगइन आवश्यक",
    loginRequiredDesc: "तपाईंको स्क्यान इतिहास ट्र्याक गर्न कृपया लगइन गर्नुहोस्",
    loginNow: "अहिले लगइन गर्नुहोस्"
  },
  sd: {
    title: "تاريخ",
    scanHistory: "اسڪين جي تاريخ",
    predictions: "اڳڪٿيون",
    registrations: "رجسٽريشن",
    noScans: "اڃا تائين ڪو اسڪين ناهي",
    noScansDesc: "توهان جي سڃاڻپ جي تاريخ هتي ظاهر ٿيندي",
    noRegistrations: "اڃا تائين ڪا رجسٽريشن ناهي",
    noRegistrationsDesc: "توهان جي ڍورن جي رجسٽريشن هتي ظاهر ٿينديون",
    synced: "هم وقت ٿيل",
    pendingSync: "هم وقت ٿيڻ باقي",
    loginRequired: "لاگ ان گهربل",
    loginRequiredDesc: "پنهنجي اسڪين جي تاريخ کي ٽريڪ ڪرڻ لاءِ مهرباني ڪري لاگ ان ڪريو",
    loginNow: "هاڻي لاگ ان ڪريو"
  },
  kok: {
    title: "इतिहास",
    scanHistory: "स्कॅन इतिहास",
    predictions: "अदमास",
    registrations: "नोंदणी",
    noScans: "आयलें खंय स्कॅन ना",
    noScansDesc: "तुमचो वळख इतिहास हांगा दिसतलो",
    noRegistrations: "आयलें खंय नोंदणी ना",
    noRegistrationsDesc: "तुमच्यो गुरां नोंदणी हांगा दिसतल्यो",
    synced: "सिंक जालें",
    pendingSync: "सिंक राविल्लें",
    loginRequired: "लॉगिन गरजेचें",
    loginRequiredDesc: "तुमचो स्कॅन इतिहास ट्रॅक करपाक उपकार करून लॉगिन करात",
    loginNow: "आतां लॉगिन करात"
  },
  doi: {
    title: "इतिहास",
    scanHistory: "स्कैन इतिहास",
    predictions: "भविष्यबाणियां",
    registrations: "पंजीकरण",
    noScans: "अज्जें तगर कोई स्कैन नेईं",
    noScansDesc: "तुंदा पछान इतिहास इत्थें दिक्खेआ",
    noRegistrations: "अज्जें तगर कोई पंजीकरण नेईं",
    noRegistrationsDesc: "तुंदे पशु पंजीकरण इत्थें दिक्खेआं",
    synced: "सिंक होई गेदा",
    pendingSync: "सिंक बाकी ऐ",
    loginRequired: "लॉगिन जरूरी ऐ",
    loginRequiredDesc: "अपने स्कैन इतिहास गी ट्रैक करने आस्तै कृपा करियै लॉगिन करो",
    loginNow: "हुने लॉगिन करो"
  },
  mni: {
    title: "ꯄꯨꯋꯥꯔꯤ",
    scanHistory: "ꯁ꯭ꯀꯦꯟ ꯄꯨꯋꯥꯔꯤ",
    predictions: "ꯄꯣꯀꯄꯁꯤꯡ",
    registrations: "ꯔꯦꯖꯤꯁ꯭ꯠꯔꯦꯁꯟ",
    noScans: "ꯍꯧꯖꯤꯛ ꯐꯥꯑꯣꯕꯥ ꯁ꯭ꯀꯦꯟ ꯂꯩꯇꯦ",
    noScansDesc: "ꯅꯍꯥꯛꯀꯤ ꯈꯉꯅꯕꯒꯤ ꯄꯨꯋꯥꯔꯤ ꯃꯐꯝ ꯑꯁꯤꯗꯥ ꯎꯕꯥ ꯐꯪꯒꯅꯤ",
    noRegistrations: "ꯍꯧꯖꯤꯛ ꯐꯥꯑꯣꯕꯥ ꯔꯦꯖꯤꯁ꯭ꯠꯔꯦꯁꯟ ꯂꯩꯇꯦ",
    noRegistrationsDesc: "ꯅꯍꯥꯛꯀꯤ ꯁꯥ ꯔꯦꯖꯤꯁ꯭ꯠꯔꯦꯁꯟ ꯃꯐꯝ ꯑꯁꯤꯗꯥ ꯎꯕꯥ ꯐꯪꯒꯅꯤ",
    synced: "ꯁꯤꯟꯛ ꯇꯧꯔꯦ",
    pendingSync: "ꯁꯤꯟꯛ ꯇꯧꯕꯗꯥ ꯂꯩꯔꯤ",
    loginRequired: "ꯂꯣꯒꯤꯟ ꯃꯊꯧ ꯇꯥꯏ",
    loginRequiredDesc: "ꯅꯍꯥꯛꯀꯤ ꯁ꯭ꯀꯦꯟ ꯄꯨꯋꯥꯔꯤ ꯇ꯭ꯔꯦꯛ ꯇꯧꯅꯕꯥ ꯆꯥꯅꯕꯤꯗꯨꯅꯥ ꯂꯣꯒꯤꯟ ꯇꯧꯕꯤꯌꯨ",
    loginNow: "ꯍꯧꯖꯤꯛ ꯂꯣꯒꯤꯟ ꯇꯧ"
  },
  sat: {
    title: "ᱱᱟᱜᱟᱢ",
    scanHistory: "ᱥᱠᱮᱱ ᱱᱟᱜᱟᱢ",
    predictions: "ᱯᱩᱭᱞᱩ ᱠᱟᱛᱷᱟ",
    registrations: "ᱧᱩᱛᱩᱢ ᱚᱞ",
    noScans: "ᱱᱤᱛᱚᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱪᱮᱫ ᱥᱠᱮᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ",
    noScansDesc: "ᱟᱢᱟᱜ ᱪᱤᱱᱦᱟᱹ ᱱᱟᱜᱟᱢ ᱱᱚᱰᱮ ᱧᱮᱞᱚᱜᱼᱟ",
    noRegistrations: "ᱱᱤᱛᱚᱜ ᱫᱷᱟᱹᱵᱤᱡ ᱪᱮᱫ ᱧᱩᱛᱩᱢ ᱚᱞ ᱵᱟᱹᱱᱩᱜᱼᱟ",
    noRegistrationsDesc: "ᱟᱢᱟᱜ ᱡᱟᱱᱣᱟᱨ ᱧᱩᱛᱩᱢ ᱚᱞ ᱱᱚᱰᱮ ᱧᱮᱞᱚᱜᱼᱟ",
    synced: "ᱥᱤᱸᱠ ᱦᱩᱭ ᱟᱠᱟᱱᱟ",
    pendingSync: "ᱥᱤᱸᱠ ᱵᱟᱠᱤ ᱢᱮᱱᱟᱜᱼᱟ",
    loginRequired: "ᱞᱚᱜᱤᱱ ᱞᱟᱹᱠᱛᱤᱜ ᱠᱟᱱᱟ",
    loginRequiredDesc: "ᱟᱢᱟᱜ ᱥᱠᱮᱱ ᱱᱟᱜᱟᱢ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱚᱜᱤᱱ ᱢᱮ",
    loginNow: "ᱱᱤᱛᱚᱜ ᱞᱚᱜᱤᱱ ᱢᱮ"
  },
  bo: {
    title: "ལོ་རྒྱུས།",
    scanHistory: "སྐེན་ལོ་རྒྱུས།",
    predictions: "སྔོན་བཤད།",
    registrations: "ཐོ་འགོད།",
    noScans: "ད་ལྟ་བར་སྐེན་མེད།",
    noScansDesc: "ཁྱེད་ཀྱི་ངོས་འཛིན་ལོ་རྒྱུས་འདིར་མངོན་པ་རེད།",
    noRegistrations: "ད་ལྟ་བར་ཐོ་འགོད་མེད།",
    noRegistrationsDesc: "ཁྱེད་ཀྱི་ནོར་པའི་ཐོ་འགོད་འདིར་མངོན་པ་རེད།",
    synced: "མཐུན་སྒྲིག་བྱས་ཟིན།",
    pendingSync: "མཐུན་སྒྲིག་མ་ཐུབ།",
    loginRequired: "ནང་འཛུལ་དགོས།",
    loginRequiredDesc: "ཁྱེད་ཀྱི་སྐེན་ལོ་རྒྱུས་ལ་རྟིང་འཇུག་བྱེད་པར་ནང་འཛུལ་གནང་རོགས།",
    loginNow: "ད་ལྟ་ནང་འཛུལ།"
  }
};

const localesDir = path.join(__dirname, 'locales');

// Add history section to each language file
Object.keys(historyTranslations).forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check if history section already exists
    if (!data.history) {
      data.history = historyTranslations[lang];
      
      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Added history translations to ${lang}.json`);
    } else {
      console.log(`⚠️  History section already exists in ${lang}.json`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✨ History translations update complete!');
