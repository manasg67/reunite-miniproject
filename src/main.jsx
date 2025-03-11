import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { BrowserRouter } from 'react-router-dom';
import Loader from './components/loder'; // Adjust the import path as needed

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

i18n.on('loaded', (loaded) => {
  console.log('i18next loaded:', loaded);
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Loader />
      <App />
    </BrowserRouter>
  </StrictMode>
);