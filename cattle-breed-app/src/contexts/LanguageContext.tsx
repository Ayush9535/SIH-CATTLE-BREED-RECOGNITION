import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
  t: (key: string, options?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language || 'en');

  useEffect(() => {
    (async () => {
      try {
        // Check if user has previously saved a language preference
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved && saved !== i18n.language) {
          // User has changed language before, restore their preference
          await i18n.changeLanguage(saved);
          setLanguage(saved);
        } else {
          // First time or no saved preference, use English (already set in i18n init)
          setLanguage('en');
        }
      } catch (e) {
        // fallback to english
        if (i18n.language !== 'en') {
          i18n.changeLanguage('en');
          setLanguage('en');
        }
      }
    })();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguage(lang);

      const rtlLangs = ['ur', 'sd'];
      const shouldRTL = rtlLangs.includes(lang);
      if (I18nManager.isRTL !== shouldRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(shouldRTL);
        // Inform user a restart may be required for full RTL layout
        // Avoid crashing by not forcing reload here
        Alert.alert(
          'Layout Updated',
          'Please restart the app to fully apply the layout direction.'
        );
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
