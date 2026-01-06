/**
 * Fix Hindi and Gujarati translations - Replace all English strings with proper translations
 */

const fs = require('fs');
const path = require('path');

// Hindi translations
const hindiTranslations = {
    home: {
        syncDesc: "सिंक होने की प्रतीक्षा में आइटम",
        popularBreeds: "लोकप्रिय भारतीय नस्लें"
    },
    upload: {
        chooseGallery: "गैलरी से चुनें",
        permissions: "कैमरा अनुमति आवश्यक",
        error: "छवि प्रोसेस करने में विफल",
        initializing: "AI मॉडल प्रारंभ कर रहा है...",
        fetchingDetails: "नस्ल विवरण प्राप्त कर रहा है...",
        translating: "आपकी भाषा में अनुवाद कर रहा है..."
    },
    chatbot: {
        placeholder: "पशु देखभाल के बारे में पूछें...",
        quickQuestions: "त्वरित प्रश्न",
        welcome: "नमस्ते! मैं आपका पशु देखभाल सहायक हूं। मुझसे पशु नस्लों, स्वास्थ्य, देखभाल या कृषि प्रथाओं के बारे में कुछ भी पूछें!"
    },
    settings: {
        offline: "ऑफ़लाइन मोड",
        subtitle: "अपने अनुभव को अनुकूलित करें",
        logoutConfirm: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
        user: {
            guest: "अतिथि उपयोगकर्ता",
            default: "उपयोगकर्ता",
            notLoggedIn: "लॉग इन नहीं है"
        }
    },
    common: {
        yes: "हां",
        no: "नहीं",
        noInternetTitle: "इंटरनेट कनेक्शन नहीं",
        noInternetDescLogin: "लॉगिन करने के लिए इंटरनेट से कनेक्ट करें।",
        noImage: "कोई छवि नहीं",
        comingSoon: "जल्द आ रहा है"
    },
    login: {
        changeNumber: "नंबर बदलें",
        mobilePlaceholder: "मोबाइल नंबर",
        verifyLogin: "सत्यापित करें और लॉगिन करें",
        resendIn: "{{seconds}} सेकंड में OTP पुनः भेजें",
        resend: "OTP पुनः भेजें",
        enterValid10: "कृपया एक मान्य 10 अंकों का फोन नंबर दर्ज करें",
        enter4Digit: "कृपया 4 अंकों का कोड दर्ज करें",
        verificationFailed: "सत्यापन विफल"
    },
    uploadExt: {
        subtitle: "नस्ल की पहचान के लिए फोटो लें या चुनें",
        addPhoto: "फोटो जोड़ें",
        analyzeBreed: "नस्ल का विश्लेषण करें",
        permissionDenied: "अनुमति अस्वीकृत",
        needCameraRoll: "फोटो अपलोड करने के लिए कैमरा रोल अनुमतियां चाहिए",
        needCamera: "फोटो लेने के लिए कैमरा अनुमतियां चाहिए",
        limitReached: "सीमा पहुंच गई",
        limit3: "आप केवल 3 छवियां अपलोड कर सकते हैं।",
        imageTooLarge: "छवि बहुत बड़ी है",
        chooseSmaller: "कृपया एक छोटी छवि चुनें या इसे संपीड़ित करें।",
        invalidImageType: "अमान्य छवि प्रकार",
        selectValidTypes: "कृपया JPEG, PNG या WebP छवि चुनें।"
    },
    chatbotExt: {
        assistantTitle: "पशु सहायक",
        online: "ऑनलाइन",
        greet: "नमस्ते! पशु सहायक में आपका स्वागत है। मैं विभिन्न पशु और भैंस नस्लों के बारे में जानने में आपकी मदद करने के लिए यहां हूं।",
        whatKnow: "आप किस बारे में जानना चाहेंगे?",
        cattle: "पशु",
        buffalo: "भैंस",
        askMore: "क्या आप और जानना चाहेंगे?",
        moreSame: "उसी नस्ल के बारे में अधिक",
        moreOther: "दूसरी नस्ल चुनें",
        exit: "बाहर निकलें",
        greatWhich: "बढ़िया! आप किस {{category}} नस्ल के बारे में जानना चाहेंगे?",
        whatAbout: "आप {{breed}} के बारे में क्या जानना चाहेंगे?",
        thankYou: "पशु सहायक का उपयोग करने के लिए धन्यवाद! कभी भी मुझसे पूछने के लिए स्वतंत्र महसूस करें।",
        labels: {
            origin: "मूल",
            history: "इतिहास",
            coatColor: "कोट रंग",
            bodySize: "शरीर का आकार",
            hornShape: "सींग का आकार",
            ears: "कान",
            distinctiveFeatures: "विशिष्ट विशेषताएं",
            dailyMilkYield: "दैनिक दूध उत्पादन",
            lactationYield: "स्तनपान उत्पादन",
            fatContent: "वसा सामग्री",
            proteinContent: "प्रोटीन सामग्री",
            lactationPeriod: "स्तनपान अवधि",
            dailyDryMatter: "दैनिक सूखा पदार्थ",
            adult: "वयस्क",
            young: "युवा",
            preferredFeed: "पसंदीदा चारा",
            commonDiseases: "सामान्य रोग",
            vaccinationsRequired: "आवश्यक टीकाकरण",
            lifespan: "जीवनकाल",
            average: "औसत",
            color: "रंग",
            size: "आकार",
            horns: "सींग",
            features: "विशेषताएं",
            daily: "दैनिक",
            perLactation: "प्रति स्तनपान",
            fat: "वसा",
            feeding: "भोजन",
            prefers: "पसंद करता है",
            liters: "लीटर",
            days: "दिन",
            kg: "किलो",
            forAdults: "वयस्कों के लिए"
        },
        options: {
            origin: "मूल और इतिहास",
            appearance: "दिखावट",
            milk: "दूध उत्पादन",
            feeding: "भोजन आवश्यकताएं",
            health: "स्वास्थ्य और देखभाल",
            all: "सभी जानकारी"
        }
    }
};

// Gujarati translations
const gujaratiTranslations = {
    home: {
        syncDesc: "સમન્વયન માટે રાહ જોઈ રહેલી વસ્તુઓ",
        popularBreeds: "લોકપ્રિય ભારતીય જાતિઓ"
    },
    upload: {
        chooseGallery: "ગેલેરીમાંથી પસંદ કરો",
        permissions: "કેમેરા પરવાનગી જરૂરી",
        error: "છબી પ્રક્રિયા કરવામાં નિષ્ફળ",
        initializing: "AI મોડેલ પ્રારંભ કરી રહ્યું છે...",
        fetchingDetails: "જાતિની વિગતો મેળવી રહ્યું છે...",
        translating: "તમારી ભાષામાં અનુવાદ કરી રહ્યું છે..."
    },
    chatbot: {
        placeholder: "પશુ સંભાળ વિશે પૂછો...",
        quickQuestions: "ઝડપી પ્રશ્નો",
        welcome: "નમસ્તે! હું તમારો પશુ સંભાળ સહાયક છું. મને પશુ જાતિઓ, આરોગ્ય, સંભાળ અથવા ખેતી પ્રથાઓ વિશે કંઈપણ પૂછો!"
    },
    settings: {
        offline: "ઑફલાઇન મોડ",
        subtitle: "તમારા અનુભવને કસ્ટમાઇઝ કરો",
        logoutConfirm: "શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?",
        user: {
            guest: "અતિથિ વપરાશકર્તા",
            default: "વપરાશકર્તા",
            notLoggedIn: "લૉગ ઇન નથી"
        }
    },
    common: {
        yes: "હા",
        no: "ના",
        noInternetTitle: "ઇન્ટરનેટ કનેક્શન નથી",
        noInternetDescLogin: "લૉગિન કરવા માટે ઇન્ટરનેટ સાથે કનેક્ટ કરો.",
        noImage: "કોઈ છબી નથી",
        comingSoon: "ટૂંક સમયમાં આવી રહ્યું છે"
    },
    login: {
        changeNumber: "નંબર બદલો",
        mobilePlaceholder: "મોબાઇલ નંબર",
        verifyLogin: "ચકાસો અને લૉગિન કરો",
        resendIn: "{{seconds}} સેકંડમાં OTP ફરીથી મોકલો",
        resend: "OTP ફરીથી મોકલો",
        enterValid10: "કૃપા કરીને માન્ય 10 અંકનો ફોન નંબર દાખલ કરો",
        enter4Digit: "કૃપા કરીને 4 અંકનો કોડ દાખલ કરો",
        verificationFailed: "ચકાસણી નિષ્ફળ"
    },
    uploadExt: {
        subtitle: "જાતિ ઓળખવા માટે ફોટો લો અથવા પસંદ કરો",
        addPhoto: "ફોટો ઉમેરો",
        analyzeBreed: "જાતિનું વિશ્લેષણ કરો",
        permissionDenied: "પરવાનગી નકારી",
        needCameraRoll: "ફોટા અપલોડ કરવા માટે કેમેરા રોલ પરવાનગીઓ જરૂરી છે",
        needCamera: "ફોટો લેવા માટે કેમેરા પરવાનગીઓ જરૂરી છે",
        limitReached: "મર્યાદા પહોંચી",
        limit3: "તમે માત્ર 3 છબીઓ અપલોડ કરી શકો છો.",
        imageTooLarge: "છબી ખૂબ મોટી છે",
        chooseSmaller: "કૃપા કરીને નાની છબી પસંદ કરો અથવા તેને સંકુચિત કરો.",
        invalidImageType: "અમાન્ય છબી પ્રકાર",
        selectValidTypes: "કૃપા કરીને JPEG, PNG અથવા WebP છબી પસંદ કરો."
    },
    chatbotExt: {
        assistantTitle: "પશુ સહાયક",
        online: "ઑનલાઇન",
        greet: "નમસ્તે! પશુ સહાયકમાં આપનું સ્વાગત છે. હું વિવિધ પશુ અને ભેંસની જાતિઓ વિશે જાણવામાં તમને મદદ કરવા માટે અહીં છું.",
        whatKnow: "તમે શું જાણવા માંગો છો?",
        cattle: "પશુ",
        buffalo: "ભેંસ",
        askMore: "શું તમે વધુ જાણવા માંગો છો?",
        moreSame: "સમાન જાતિ વિશે વધુ",
        moreOther: "બીજી જાતિ પસંદ કરો",
        exit: "બહાર નીકળો",
        greatWhich: "સરસ! તમે કઈ {{category}} જાતિ વિશે જાણવા માંગો છો?",
        whatAbout: "તમે {{breed}} વિશે શું જાણવા માંગો છો?",
        thankYou: "પશુ સહાયકનો ઉપયોગ કરવા બદલ આભાર! કોઈપણ સમયે મને પૂછવા માટે નિઃસંકોચ અનુભવો.",
        labels: {
            origin: "મૂળ",
            history: "ઇતિહાસ",
            coatColor: "કોટ રંગ",
            bodySize: "શરીરનું કદ",
            hornShape: "શિંગડાનો આકાર",
            ears: "કાન",
            distinctiveFeatures: "વિશિષ્ટ લક્ષણો",
            dailyMilkYield: "દૈનિક દૂધ ઉત્પાદન",
            lactationYield: "સ્તનપાન ઉત્પાદન",
            fatContent: "ચરબી સામગ્રી",
            proteinContent: "પ્રોટીન સામગ્રી",
            lactationPeriod: "સ્તનપાન સમયગાળો",
            dailyDryMatter: "દૈનિક સૂકો પદાર્થ",
            adult: "પુખ્ત",
            young: "યુવાન",
            preferredFeed: "પસંદગીનો ચારો",
            commonDiseases: "સામાન્ય રોગો",
            vaccinationsRequired: "જરૂરી રસીકરણ",
            lifespan: "આયુષ્ય",
            average: "સરેરાશ",
            color: "રંગ",
            size: "કદ",
            horns: "શિંગડા",
            features: "લક્ષણો",
            daily: "દૈનિક",
            perLactation: "પ્રતિ સ્તનપાન",
            fat: "ચરબી",
            feeding: "ખોરાક",
            prefers: "પસંદ કરે છે",
            liters: "લિટર",
            days: "દિવસો",
            kg: "કિલો",
            forAdults: "પુખ્તો માટે"
        },
        options: {
            origin: "મૂળ અને ઇતિહાસ",
            appearance: "દેખાવ",
            milk: "દૂધ ઉત્પાદન",
            feeding: "ખોરાકની જરૂરિયાતો",
            health: "આરોગ્ય અને સંભાળ",
            all: "બધી માહિતી"
        }
    }
};

// Deep merge function
function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

// Update Hindi
const hiPath = path.join(__dirname, 'locales', 'hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
deepMerge(hiData, hindiTranslations);
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n', 'utf8');
console.log('✅ Hindi translations updated!');

// Update Gujarati
const guPath = path.join(__dirname, 'locales', 'gu.json');
const guData = JSON.parse(fs.readFileSync(guPath, 'utf8'));
deepMerge(guData, gujaratiTranslations);
fs.writeFileSync(guPath, JSON.stringify(guData, null, 2) + '\n', 'utf8');
console.log('✅ Gujarati translations updated!');

console.log('\n✨ All translations fixed successfully!');
