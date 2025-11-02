import React, { useContext } from 'react';
import { LanguageContext } from '../App';

const GovernmentSchemes: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const schemes = [
    { name: t('PM-KISAN Scheme'), description: t('Provides income support of ₹6,000 per year to all farmer families.'), link: '#' },
    { name: t('Pradhan Mantri Fasal Bima Yojana (PMFBY)'), description: t('Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.'), link: '#' },
    { name: t('Soil Health Card Scheme'), description: t('Provides farmers with soil health cards to help them manage soil nutrients effectively.'), link: '#' },
    { name: t('Kisan Credit Card (KCC) Scheme'), description: t('Offers short-term formal credit to farmers.'), link: '#' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Government Scheme Finder')}</h2>
      
      <div className="mb-8">
        <input 
          type="text"
          placeholder={t('Search for schemes (e.g., crop insurance, subsidy)...')}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-6">
        {schemes.map(scheme => (
          <div key={scheme.name} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-700">{scheme.name}</h3>
            <p className="text-gray-600 mt-2">{scheme.description}</p>
            <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 inline-block">{t('Learn More')} →</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemes;