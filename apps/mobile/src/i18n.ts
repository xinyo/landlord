import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, zh } from "@landlord/core";

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, zh: { translation: zh } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
});

export default i18n;

