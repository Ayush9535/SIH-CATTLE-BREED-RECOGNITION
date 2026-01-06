const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const files = fs.readdirSync(localesDir);

const migrations = [
    { old: "murrah", new: "murrahBuffalo" },
    { old: "jafarabadi", new: "jafarabadiBuffalo" },
    { old: "niliRavi", new: "nili-RaviBuffalo" },
    { old: "pandharpuri", new: "pandharpuriBuffalo" },
    { old: "hFCross", new: "hFCross" } // Just ensuring consistency if needed
];

files.forEach(file => {
    if (file === 'en.json') return; // en.json already fixed by user script

    const filePath = path.join(localesDir, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        if (data.breeds) {
            migrations.forEach(mig => {
                // If old key exists and new key doesn't
                if (data.breeds[mig.old] && !data.breeds[mig.new]) {
                    data.breeds[mig.new] = data.breeds[mig.old];
                    modified = true;
                }
                // If old key exists and new key exists (maybe fallback), overwrite new with old (real translation)
                else if (data.breeds[mig.old] && data.breeds[mig.new] && data.breeds[mig.new].includes("Buffalo") && !data.breeds[mig.old].includes("Buffalo")) {
                    // Heuristic: if new value looks English (contains "Buffalo") and old value doesn't (likely localized), use old.
                    // But simplest is just to copy old to new if old exists.
                    if (data.breeds[mig.old] !== data.breeds[mig.new]) {
                        data.breeds[mig.new] = data.breeds[mig.old];
                        modified = true;
                    }
                }
            });
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Migrated keys in ${file}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
});
