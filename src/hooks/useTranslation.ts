import { useAppSelector } from '@/store';
import trTranslations from '@/locales/tr.json';
import enTranslations from '@/locales/en.json';

const translations = {
  tr: trTranslations,
  en: enTranslations
};

export function useTranslation() {
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Turkish if key not found
        value = translations.tr;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key itself if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, currentLanguage };
}
