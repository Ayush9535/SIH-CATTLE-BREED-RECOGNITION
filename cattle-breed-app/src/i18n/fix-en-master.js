const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Fix Hindi strings back to English
en.home.viewHistory = "View History";
en.upload.subtitle = "Take or upload a photo of your cattle";
en.upload.choosePhoto = "Choose from Gallery";
en.upload.uploadError = "Upload Error";
en.upload.noImageSelected = "No image selected";
en.upload.selectImageFirst = "Please select an image first";
en.upload.ok = "OK";
en.upload.processingImage = "Processing image...";
en.upload.detectingBreed = "Detecting breed...";
en.upload.analyzingFeatures = "Analyzing features...";
en.upload.generatingResults = "Generating results...";

en.chatbot.inputPlaceholder = "Type your question here...";
en.chatbot.send = "Send";
en.chatbot.errorMessage = "Sorry, something went wrong. Please try again.";
en.chatbot.welcomeMessage = "Hello! I am your AI cattle care assistant. Ask me anything!";
en.chatbot.suggestions = {
    "feeding": "What is the right diet?",
    "health": "What are common diseases?",
    "breeding": "Best practices for breeding?",
    "vaccination": "Vaccination schedule?"
};

// Add missing auth.guestUser
if (!en.auth.guestUser) {
    en.auth.guestUser = "Guest User";
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
console.log('✅ Fixed en.json: Restored English strings and added auth.guestUser');
