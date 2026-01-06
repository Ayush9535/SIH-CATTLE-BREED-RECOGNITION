const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'locales', 'en.json');

const corrections = {
    breeds: {
        "murrahBuffalo": "Murrah Buffalo",
        "jafarabadiBuffalo": "Jafarabadi Buffalo",
        "surti": "Surti",
        "nili-RaviBuffalo": "Nili-Ravi Buffalo",
        "pandharpuriBuffalo": "Pandharpuri Buffalo",
        "hFCross": "HF Cross"
    },
    common: {
        "edit": "Edit",
        "skip": "Skip",
        "retry": "Retry",
        "close": "Close",
        "search": "Search",
        "filter": "Filter",
        "sort": "Sort",
        "refresh": "Refresh"
    },
    register: {
        "subtitle": "Add your cattle details",
        "photos": "Photos",
        "addPhoto": "Add Photo",
        "required": "Required",
        "optional": "Optional",
        "species": {
            "cattle": "Cattle",
            "buffalo": "Buffalo"
        }
    },
    service: {
        "offline": "Offline Mode",
        "offlineDesc": "You are offline. Data will be saved locally."
    }
};

if (fs.existsSync(enPath)) {
    const data = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // Apply corrections
    if (data.breeds) Object.assign(data.breeds, corrections.breeds);
    if (data.common) Object.assign(data.common, corrections.common);
    if (data.register) Object.assign(data.register, corrections.register);
    if (data.service) Object.assign(data.service, corrections.service);

    fs.writeFileSync(enPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Fixed en.json translations');
}
