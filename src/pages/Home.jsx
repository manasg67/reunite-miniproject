import React from 'react'
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  
  // Just pass the English text and a unique key
  return (
    <div>
      {/* This will automatically get translated to Hindi when language is switched */}
      <h1>{t('My Website')}</h1>
    </div>
  );
}

export default Home