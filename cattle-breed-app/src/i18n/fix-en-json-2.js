const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'locales', 'en.json');

const corrections = {
    service: {
        "online": "Online Mode",
        "onlineDesc": "Connected. Changes will be synced."
    }
};

if (fs.existsSync(enPath)) {
    const data = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // Apply corrections
    if (data.service) Object.assign(data.service, corrections.service);

    fs.writeFileSync(enPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Fixed remaining en.json translations');
}
