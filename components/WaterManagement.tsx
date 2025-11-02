import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import Spinner from './icons/Spinner';

const WaterManagement: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [crop, setCrop] = useState('');
  const [soilType, setSoilType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const getAdvice = () => {
    if (!crop || !soilType) return;
    setIsLoading(true);
    setAdvice(null);
    setTimeout(() => {
      setAdvice(
        t('Irrigation Schedule: Water deeply every 3-4 days in the morning to reduce evaporation.\n\n') +
        t('Technique: Drip irrigation is highly recommended for this crop and soil type to save up to 60% of water.\n\n') +
        t('Conservation Tip: Use mulch (like straw or plastic sheets) around the base of plants to retain soil moisture and reduce weed growth.')
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Water Management Assistant')}</h2>
        <p className="text-gray-600 mb-6">{t('Get AI-driven advice on optimal irrigation schedules for your crop.')}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Your Crop (e.g., Tomato, Wheat)')}</label>
            <input 
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Your Soil Type (e.g., Clay, Sandy)')}</label>
            <input 
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
            />
          </div>
          <button
            onClick={getAdvice}
            disabled={isLoading || !crop || !soilType}
            className="w-full mt-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2">
            {isLoading && <Spinner />}
            <span>{isLoading ? t('Getting Advice...') : t('Get Water Advice')}</span>
          </button>
        </div>
      </div>
      
      {advice && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('AI Water Recommendation')}</h3>
          <pre className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap font-sans">{advice}</pre>
        </div>
      )}
    </div>
  );
};

export default WaterManagement;