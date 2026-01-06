/**
 * Fix Tamil translations - Replace all English strings with proper Tamil translations
 */

const fs = require('fs');
const path = require('path');

const taFilePath = path.join(__dirname, 'locales', 'ta.json');

// Read the Tamil file
const taData = JSON.parse(fs.readFileSync(taFilePath, 'utf8'));

// Tamil translations for all the English strings found
const tamilTranslations = {
    home: {
        syncDesc: "ஒத்திசைக்க காத்திருக்கும் உருப்படிகள்",
        popularBreeds: "பிரபலமான இந்திய இனங்கள்"
    },
    upload: {
        chooseGallery: "கேலரியிலிருந்து தேர்ந்தெடுக்கவும்",
        permissions: "கேமரா அனுமதி தேவை",
        error: "படத்தை செயலாக்க முடியவில்லை",
        initializing: "AI மாதிரியை துவக்குகிறது...",
        fetchingDetails: "இன விவரங்களைப் பெறுகிறது...",
        translating: "உங்கள் மொழிக்கு மொழிபெயர்க்கிறது..."
    },
    chatbot: {
        placeholder: "கால்நடை பராமரிப்பு பற்றி கேளுங்கள்...",
        quickQuestions: "விரைவு கேள்விகள்",
        welcome: "வணக்கம்! நான் உங்கள் கால்நடை பராமரிப்பு உதவியாளர். கால்நடை இனங்கள், ஆரோக்கியம், பராமரிப்பு அல்லது விவசாய நடைமுறைகள் பற்றி என்னிடம் எதையும் கேளுங்கள்!"
    },
    settings: {
        offline: "ஆஃப்லைன் பயன்முறை",
        subtitle: "உங்கள் அனுபவத்தைத் தனிப்பயனாக்கவும்",
        logoutConfirm: "நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
        user: {
            guest: "விருந்தினர் பயனர்",
            default: "பயனர்",
            notLoggedIn: "உள்நுழையவில்லை"
        }
    },
    common: {
        yes: "ஆம்",
        no: "இல்லை",
        noInternetTitle: "இணைய இணைப்பு இல்லை",
        noInternetDescLogin: "உள்நுழைய இணையத்துடன் இணைக்கவும்.",
        noImage: "படம் இல்லை",
        comingSoon: "விரைவில் வரும்"
    },
    login: {
        changeNumber: "எண்ணை மாற்றவும்",
        mobilePlaceholder: "மொபைல் எண்",
        verifyLogin: "சரிபார்த்து உள்நுழையவும்",
        resendIn: "{{seconds}} விநாடிகளில் OTP மீண்டும் அனுப்பவும்",
        resend: "OTP மீண்டும் அனுப்பவும்",
        enterValid10: "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்",
        enter4Digit: "4 இலக்க குறியீட்டை உள்ளிடவும்",
        verificationFailed: "சரிபார்ப்பு தோல்வியடைந்தது"
    },
    uploadExt: {
        subtitle: "இனத்தை அடையாளம் காண புகைப்படம் எடுக்கவும் அல்லது தேர்ந்தெடுக்கவும்",
        addPhoto: "புகைப்படம் சேர்க்கவும்",
        analyzeBreed: "இனத்தை பகுப்பாய்வு செய்யவும்",
        permissionDenied: "அனுமதி மறுக்கப்பட்டது",
        needCameraRoll: "புகைப்படங்களைப் பதிவேற்ற கேமரா ரோல் அனுமதிகள் தேவை",
        needCamera: "புகைப்படம் எடுக்க கேமரா அனுமதிகள் தேவை",
        limitReached: "வரம்பை அடைந்துவிட்டது",
        limit3: "நீங்கள் 3 படங்கள் வரை மட்டுமே பதிவேற்ற முடியும்.",
        imageTooLarge: "படம் மிகப் பெரியது",
        chooseSmaller: "சிறிய படத்தைத் தேர்ந்தெடுக்கவும் அல்லது சுருக்கவும்.",
        invalidImageType: "தவறான படவகை",
        selectValidTypes: "JPEG, PNG அல்லது WebP படத்தைத் தேர்ந்தெடுக்கவும்."
    },
    chatbotExt: {
        assistantTitle: "கால்நடை உதவியாளர்",
        online: "ஆன்லைன்",
        greet: "வணக்கம்! கால்நடை உதவியாளருக்கு வரவேற்கிறோம். பல்வேறு கால்நடை மற்றும் எருமை இனங்களைப் பற்றி அறிய நான் இங்கே உள்ளேன்.",
        whatKnow: "நீங்கள் எதைப் பற்றி தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
        cattle: "கால்நடை",
        buffalo: "எருமை",
        askMore: "மேலும் தெரிந்து கொள்ள விரும்புகிறீர்களா?",
        moreSame: "அதே இனத்தைப் பற்றி மேலும்",
        moreOther: "வேறு இனத்தைத் தேர்ந்தெடுக்கவும்",
        exit: "வெளியேறு",
        greatWhich: "அருமை! எந்த {{category}} இனத்தைப் பற்றி தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
        whatAbout: "{{breed}} பற்றி என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
        thankYou: "கால்நடை உதவியாளரைப் பயன்படுத்தியதற்கு நன்றி! எப்போது வேண்டுமானாலும் என்னிடம் கேளுங்கள்.",
        labels: {
            origin: "தோற்றம்",
            history: "வரலாறு",
            coatColor: "கோட் நிறம்",
            bodySize: "உடல் அளவு",
            hornShape: "கொம்பு வடிவம்",
            ears: "காதுகள்",
            distinctiveFeatures: "தனித்துவமான அம்சங்கள்",
            dailyMilkYield: "தினசரி பால் உற்பத்தி",
            lactationYield: "பால்கட்டு உற்பத்தி",
            fatContent: "கொழுப்பு உள்ளடக்கம்",
            proteinContent: "புரத உள்ளடக்கம்",
            lactationPeriod: "பால்கட்டு காலம்",
            dailyDryMatter: "தினசரி உலர் பொருள்",
            adult: "வயது வந்தோர்",
            young: "இளம்",
            preferredFeed: "விருப்பமான உணவு",
            commonDiseases: "பொதுவான நோய்கள்",
            vaccinationsRequired: "தேவையான தடுப்பூசிகள்",
            lifespan: "ஆயுட்காலம்",
            average: "சராசரி",
            color: "நிறம்",
            size: "அளவு",
            horns: "கொம்புகள்",
            features: "அம்சங்கள்",
            daily: "தினசரி",
            perLactation: "ஒரு பால்கட்டுக்கு",
            fat: "கொழுப்பு",
            feeding: "உணவு",
            prefers: "விரும்புகிறது",
            liters: "லிட்டர்கள்",
            days: "நாட்கள்",
            kg: "கிலோ",
            forAdults: "வயது வந்தோருக்கு"
        },
        options: {
            origin: "தோற்றம் மற்றும் வரலாறு",
            appearance: "தோற்றம்",
            milk: "பால் உற்பத்தி",
            feeding: "உணவு தேவைகள்",
            health: "ஆரோக்கியம் மற்றும் பராமரிப்பு",
            all: "அனைத்து தகவல்களும்"
        }
    },
    registration: {
        error: "பதிவு விவரங்களை ஏற்றுவதில் பிழை",
        goBack: "திரும்பிச் செல்லவும்",
        tag: "குறிச்சொல்",
        synced: "ஒத்திசைக்கப்பட்டது",
        pending: "நிலுவையில்",
        registeredOn: "பதிவு செய்யப்பட்ட தேதி",
        breedOverridden: "இனம் மேலெழுதப்பட்டது",
        reason: "காரணம்",
        aiPredicted: "AI கணிப்பு",
        y: "வ",
        m: "மா",
        premises: "வளாகம்",
        unknownLocation: "அறியப்படாத இடம்",
        sections: {
            animalInfo: "விலங்கு தகவல்",
            physicalTraits: "உடல் பண்புகள்",
            ownerDetails: "உரிமையாளர் விவரங்கள்",
            location: "இடம்"
        }
    },
    register: {
        fillRequired: "அனைத்து தேவையான புலங்களையும் நிரப்பவும்",
        invalidPhone: "தவறான தொலைபேசி எண்",
        enterValidPhone: "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்",
        successSaved: "பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது!",
        saveFailed: "பதிவைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        submit: "பதிவை சமர்ப்பிக்கவும்",
        fields: {
            tagId: "பசு ஆதார் குறிச்சொல் ஐடி",
            species: "இனம்",
            breed: "வகை",
            override: "மேலெழுதவும்",
            correctBreed: "சரியான இனம்",
            overrideReason: "மேலெழுதும் காரணம்",
            sex: "பாலினம்",
            phenotype: "பினோடைபிக் பண்புகள்",
            marks: "அடையாள குறிகள்",
            breedingHistory: "இனப்பெருக்க வரலாறு",
            vaccination: "தடுப்பூசி பதிவுகள்",
            milkYield: "பால் உற்பத்தி தகவல்",
            birthDeath: "பிறப்பு/இறப்பு பதிவு",
            ownerName: "உரிமையாளர் பெயர்",
            ownerContact: "உரிமையாளர் தொடர்பு",
            ownerAddress: "உரிமையாளர் முகவரி",
            premisesType: "வளாக வகை",
            premisesLocation: "வளாக இடம்",
            ageYears: "வயது (ஆண்டுகள்)",
            ageMonths: "வயது (மாதங்கள்)"
        },
        sex: {
            female: "பெண்",
            male: "ஆண்"
        },
        placeholders: {
            tagId: "12 இலக்க குறிச்சொல் ஐடியை உள்ளிடவும்",
            correctBreed: "சரியான இன பெயரை உள்ளிடவும்",
            overrideReason: "AI கணிப்பு ஏன் தவறானது?",
            premisesType: "எ.கா., பண்ணை, பால் பண்ணை, வீடு",
            premisesLocation: "எ.கா., கிராமம், மாவட்டம்"
        },
        sections: {
            identity: "விலங்கு அடையாளம்",
            age: "வயது மற்றும் இனப்பெருக்க தகவல்",
            health: "ஆரோக்கியம் மற்றும் உற்பத்தி",
            owner: "உரிமையாளர் விவரங்கள்"
        }
    },
    service: {
        active: "சேவை செயலில் உள்ளது",
        checking: "சேவை நிலையைச் சரிபார்க்கிறது...",
        wakingUp: "சர்வரை எழுப்புகிறது...",
        offlineTap: "சேவை ஆஃப்லைன். மீண்டும் முயற்சிக்க தட்டவும்."
    },
    result: {
        loading: "படங்களை பகுப்பாய்வு செய்கிறது...",
        matchLabel: "% பொருத்தம்",
        topMatches: "சிறந்த பொருத்தங்கள்",
        analyzeAnother: "மற்றொரு புகைப்படத்தை பகுப்பாய்வு செய்யவும்",
        toHome: "முகப்புக்கு",
        disclaimer: "இது AI அடிப்படையிலான கணிப்பு. அதிகாரப்பூர்வ பதிவுக்கு, உள்ளூர் கால்நடை மருத்துவ அதிகாரிகளுடன் கலந்தாலோசிக்கவும்.",
        guestLockedTitle: "உள்நுழைவு தேவை",
        guestLockedDesc: "விரிவான இன தகவல், பண்புகள் மற்றும் பராமரிப்பு குறிப்புகளைப் பார்க்க உள்நுழையவும்.",
        guestLoginNow: "இப்போது உள்நுழையவும்"
    },
    history: {
        scanHistory: "ஸ்கேன் வரலாறு",
        predictions: "கணிப்புகள்",
        registrations: "பதிவுகள்",
        noScans: "இன்னும் ஸ்கேன்கள் இல்லை",
        noScansDesc: "உங்கள் அடையாள வரலாறு இங்கே தோன்றும்",
        noRegistrations: "இன்னும் பதிவுகள் இல்லை",
        noRegistrationsDesc: "உங்கள் கால்நடை பதிவுகள் இங்கே தோன்றும்",
        loginRequired: "உள்நுழைவு தேவை",
        loginRequiredDesc: "உங்கள் ஸ்கேன் வரலாற்றைக் கண்காணிக்க உள்நுழையவும்",
        loginNow: "இப்போது உள்நுழையவும்"
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

// Apply translations
deepMerge(taData, tamilTranslations);

// Write back
fs.writeFileSync(taFilePath, JSON.stringify(taData, null, 2) + '\n', 'utf8');

console.log('✅ Tamil translations updated successfully!');
console.log('All English strings have been replaced with proper Tamil translations.');
