import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import PestIcon from './icons/PestIcon';

const PestOutbreakMap: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Pest & Disease Outbreak Map')}</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-gray-600 mb-4">{t('View reported pest and disease outbreaks in your area. This data is crowdsourced and updated regularly.')}</p>
        <div className="relative bg-gray-200 rounded-lg h-96 overflow-hidden">
          {/* This is a placeholder for a real map */}
          <img src="https://i.imgur.com/3Z0A2p7.png" alt="Map of India" className="w-full h-full object-cover opacity-50"/>
          
          {/* Mock pest locations */}
          <div className="absolute text-red-600" style={{ top: '30%', left: '40%' }}>
            <PestIcon className="w-8 h-8" />
            <span className="absolute -top-6 -right-12 bg-white px-2 py-1 rounded shadow text-xs font-bold w-24 text-center">{t('Bollworm Outbreak')}</span>
          </div>
           <div className="absolute text-red-600" style={{ top: '50%', left: '70%' }}>
            <PestIcon className="w-8 h-8" />
            <span className="absolute -top-6 -right-10 bg-white px-2 py-1 rounded shadow text-xs font-bold w-20 text-center">{t('Aphid Alert')}</span>
          </div>
           <div className="absolute text-red-600" style={{ top: '65%', left: '55%' }}>
            <PestIcon className="w-8 h-8" />
            <span className="absolute -top-6 -right-12 bg-white px-2 py-1 rounded shadow text-xs font-bold w-24 text-center">{t('Whitefly Reported')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestOutbreakMap;