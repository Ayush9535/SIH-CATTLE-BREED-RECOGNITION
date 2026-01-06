/**
 * Comprehensive Translation Validation Script
 * Verifies 100% translation coverage across all locale files
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');

// Read all locale files
const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔍 Translation Coverage Validation\n');
console.log(`Found ${localeFiles.length} language files\n`);

// Read English as master
const enPath = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Function to get all keys recursively
function getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

const masterKeys = getAllKeys(enData);
console.log(`📊 Master English file has ${masterKeys.length} translation keys\n`);

let totalIssues = 0;
const results = [];

// Validate each locale file
localeFiles.forEach(file => {
    const langCode = file.replace('.json', '');
    const filePath = path.join(localesDir, file);

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const langKeys = getAllKeys(data);

        const missingKeys = masterKeys.filter(key => !langKeys.includes(key));
        const extraKeys = langKeys.filter(key => !masterKeys.includes(key));

        // Check for empty values
        const emptyKeys = [];
        function checkEmpty(obj, prefix = '') {
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    checkEmpty(obj[key], fullKey);
                } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
                    emptyKeys.push(fullKey);
                }
            }
        }
        checkEmpty(data);

        const issues = missingKeys.length + extraKeys.length + emptyKeys.length;
        totalIssues += issues;

        results.push({
            langCode,
            file,
            totalKeys: langKeys.length,
            missingKeys,
            extraKeys,
            emptyKeys,
            issues
        });

    } catch (error) {
        console.error(`❌ Error reading ${file}:`, error.message);
        totalIssues++;
    }
});

// Print results
results.forEach(result => {
    if (result.issues === 0) {
        console.log(`✅ ${result.file.padEnd(15)} - ${result.totalKeys} keys - 100% COMPLETE`);
    } else {
        console.log(`⚠️  ${result.file.padEnd(15)} - ${result.totalKeys} keys - ${result.issues} issues`);
        if (result.missingKeys.length > 0) {
            console.log(`   Missing: ${result.missingKeys.slice(0, 5).join(', ')}${result.missingKeys.length > 5 ? '...' : ''}`);
        }
        if (result.extraKeys.length > 0) {
            console.log(`   Extra: ${result.extraKeys.slice(0, 5).join(', ')}${result.extraKeys.length > 5 ? '...' : ''}`);
        }
        if (result.emptyKeys.length > 0) {
            console.log(`   Empty: ${result.emptyKeys.slice(0, 5).join(', ')}${result.emptyKeys.length > 5 ? '...' : ''}`);
        }
    }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📈 Summary:`);
console.log(`   Total Languages: ${localeFiles.length}`);
console.log(`   Master Keys: ${masterKeys.length}`);
console.log(`   Total Issues: ${totalIssues}`);
console.log(`   Coverage: ${totalIssues === 0 ? '100% ✨' : `${((1 - totalIssues / (masterKeys.length * localeFiles.length)) * 100).toFixed(1)}%`}`);

if (totalIssues === 0) {
    console.log('\n🎉 All translations are complete! 100% coverage achieved!\n');
} else {
    console.log('\n⚠️  Some translations need attention.\n');
}

// Save detailed report
const report = {
    timestamp: new Date().toISOString(),
    masterKeys: masterKeys.length,
    languages: localeFiles.length,
    totalIssues,
    coverage: totalIssues === 0 ? 100 : ((1 - totalIssues / (masterKeys.length * localeFiles.length)) * 100).toFixed(2),
    results
};

fs.writeFileSync(
    path.join(__dirname, '..', '..', 'TRANSLATION_VALIDATION_REPORT.json'),
    JSON.stringify(report, null, 2),
    'utf8'
);

console.log('📄 Detailed report saved to TRANSLATION_VALIDATION_REPORT.json\n');
