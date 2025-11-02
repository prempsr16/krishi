import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import { generateRotationPlan } from '../services/geminiService';
import type { AIResponseRotationPlan } from '../types';
import Spinner from './icons/Spinner';

const CropRotationPlanner: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
  
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pastCrops, setPastCrops] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<AIResponseRotationPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
      if (!location || !soilType || !pastCrops) {
          setError(t('Please fill in all fields to generate a plan.'));
          return;
      }
      setIsLoading(true);
      setError(null);
      setPlanData(null);

      const result = await generateRotationPlan(location, soilType, pastCrops, language);
      if (result) {
          setPlanData(result);
      } else {
          setError(t('Could not generate a plan. Please try again.'));
      }
      setIsLoading(false);
  };


  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('AI-Powered 3-Year Crop Rotation Plan')}</h2>
        <p className="text-gray-600 mb-6">{t('Enter your farm details to generate a personalized crop rotation plan.')}</p>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('Your Location (e.g., Pune, Maharashtra)')}</label>
                <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{t('Your Soil Type (e.g., Black, Alluvial)')}</label>
                <input 
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{t('Previous Crops (e.g., Cotton, Wheat)')}</label>
                <input 
                    type="text"
                    value={pastCrops}
                    onChange={(e) => setPastCrops(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500"
                />
            </div>
             <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="w-full mt-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2">
                {isLoading && <Spinner />}
                <span>{isLoading ? t('Generating Plan...') : t('Generate Plan')}</span>
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
      
      {isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center">
            <Spinner className="w-8 h-8 text-green-500" />
            <span className="ml-4 text-gray-600">{t('Generating Plan...')}</span>
        </div>
      )}

      {planData && (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('3-Year Crop Rotation Plan')}</h2>
                <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-gray-600">{t('Year')}</th>
                        <th className="px-4 py-2 font-semibold text-gray-600">{t('Kharif Season')}</th>
                        <th className="px-4 py-2 font-semibold text-gray-600">{t('Rabi Season')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {planData.plan.map((item) => (
                        <tr key={item.year} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{item.year}</td>
                        <td className="px-4 py-3">{item.kharif}</td>
                        <td className="px-4 py-3">{item.rabi}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('AI Reasoning & Suggestion')}</h3>
                <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 rounded-md">
                <p>{planData.suggestion}</p>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default CropRotationPlanner;
