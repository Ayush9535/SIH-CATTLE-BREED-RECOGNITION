/**
 * Add breed name translation helper to result screen
 * This will translate English breed names to the selected language
 */

const fs = require('fs');
const path = require('path');

const resultPath = path.join(__dirname, '..', 'app', 'result.tsx');
let code = fs.readFileSync(resultPath, 'utf8');

// Find the line where breedData is created and add translation logic
const oldCode = `  // Convert to BreedData format - always non-null (memoized for performance)
  const breedData = React.useMemo(() => ({
    breedName: originalResult.breedName,`;

const newCode = `  // Translate breed name to selected language
  const translateBreedName = (englishName: string): string => {
    const breedMap: { [key: string]: string } = {
      'Gir': 'breeds.gir',
      'Sahiwal': 'breeds.sahiwal',
      'Red Sindhi': 'breeds.redSindhi',
      'Rathi': 'breeds.rathi',
      'Tharparkar': 'breeds.tharparkar',
      'Kankrej': 'breeds.kankrej',
      'Ongole': 'breeds.ongole',
      'Hariana': 'breeds.hariana',
      'Kangayam': 'breeds.kangayam',
      'Hallikar': 'breeds.hallikar',
      'Khillari': 'breeds.khillari',
      'Deoni': 'breeds.deoni',
      'Murrah': 'breeds.murrah',
      'Jaffarabadi': 'breeds.jaffarabadi',
      'Surti': 'breeds.surti',
      'Nili Ravi': 'breeds.niliRavi',
      'Pandharpuri': 'breeds.pandharpuri'
    };
    
    const translationKey = breedMap[englishName];
    return translationKey ? t(translationKey) : englishName;
  };

  // Convert to BreedData format - always non-null (memoized for performance)
  const breedData = React.useMemo(() => ({
    breedName: translateBreedName(originalResult.breedName),`;

code = code.replace(oldCode, newCode);

// Also need to update the dependency array to include 't'
code = code.replace(
    '}), [originalResult]);',
    '}), [originalResult, t]);'
);

fs.writeFileSync(resultPath, code, 'utf8');

console.log('✅ Added breed name translation to result screen!');
console.log('Breed names will now appear in the selected language.');
