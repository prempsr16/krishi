
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import { generateText } from '../services/geminiService';
import Spinner from './icons/Spinner';
import AlertIcon from './icons/AlertIcon';

type DisasterType = '' | 'Flood' | 'Drought' | 'Hailstorm' | 'Pest Attack' | 'Cyclone';

const DisasterManagement: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [disasterType, setDisasterType] = useState<DisasterType>('');
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetAdvice = async () => {
        if (!disasterType) {
            setError(t('Please select a disaster type first.'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setAdvice(null);
        
        const prompt = `I am a farmer in India facing a '${disasterType}'. Provide a clear, actionable, and concise list of steps to take immediately to protect my crops and farm. Also, provide a separate list of post-disaster recovery steps. Structure the response with clear headings.`;

        const result = await generateText(prompt, language);
        setAdvice(result);
        setIsLoading(false);
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                    <AlertIcon className="w-8 h-8 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-800">{t('AI-Powered Disaster Assistance')}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t('Select a disaster type to get immediate advice from our AI on how to protect your farm.')}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">{t('Select Disaster Type')}</label>
                        <select
                            value={disasterType}
                            onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="" disabled>{t('Select Disaster Type')}</option>
                            <option value="Flood">{t('Flood')}</option>
                            <option value="Drought">{t('Drought')}</option>
                            <option value="Hailstorm">{t('Hailstorm')}</option>
                            <option value="Pest Attack">{t('Pest Attack')}</option>
                            <option value="Cyclone">{t('Cyclone')}</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGetAdvice}
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? <Spinner className="w-5 h-5"/> : <AlertIcon className="w-5 h-5" />}
                        <span>{isLoading ? t('Getting Advice...') : t('Get Advice')}</span>
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {isLoading && (
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                    <Spinner className="w-12 h-12 text-red-500" />
                    <p className="mt-4 text-gray-600 font-semibold">{t('Our AI is generating disaster-response steps for you...')}</p>
                </div>
            )}

            {advice && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('AI Recommendation')}</h3>
                    <div 
                        className="prose prose-green max-w-none" 
                        dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />') }} 
                    />
                </div>
            )}
        </div>
    );
};

export default DisasterManagement;
