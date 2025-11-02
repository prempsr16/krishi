import React, { useState, useEffect, useCallback, useContext } from 'react';
import type { FarmProfile } from '../types';
import { generateText } from '../services/geminiService';
import Spinner from './icons/Spinner';
import { LanguageContext } from '../App';

interface MyFarmProps {
  profile: FarmProfile;
  setProfile: (profile: FarmProfile) => void;
}

const MyFarm: React.FC<MyFarmProps> = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmProfile>(profile);
  const [personalizedTip, setPersonalizedTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const { language, t } = useContext(LanguageContext);

  const fetchPersonalizedTip = useCallback(async (currentProfile: FarmProfile) => {
    if (!currentProfile.crop || !currentProfile.location) return;
    setIsLoadingTip(true);
    const prompt = `I am a farmer in ${currentProfile.location} growing ${currentProfile.crop}. Give me one specific, actionable tip relevant to my situation.`;
    const tip = await generateText(prompt, language);
    setPersonalizedTip(tip);
    setIsLoadingTip(false);
  }, [language]);

  useEffect(() => {
    // Fetch tip only if a profile exists
    if (profile.crop && profile.location) {
        fetchPersonalizedTip(profile);
    }
  }, [profile, fetchPersonalizedTip]);

  const handleEditToggle = () => {
    setFormData(profile);
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const calculateDate = (startDate: string, daysToAdd: number): string => {
    if (!startDate) return t('Not set');
    try {
        const date = new Date(startDate);
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    } catch {
        return 'Invalid Date';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('My Farm Profile')}</h2>
            <button onClick={handleEditToggle} className="text-sm font-semibold text-green-600 hover:text-green-800">
                {isEditing ? t('Cancel') : t('Edit Profile')}
            </button>
        </div>
        
        {isEditing ? (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Location (e.g., Nashik, Maharashtra)')}</label>
                    <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Main Crop')}</label>
                    <input 
                        type="text"
                        value={formData.crop}
                        onChange={(e) => setFormData({...formData, crop: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('Sowing Date')}</label>
                    <input 
                        type="date"
                        value={formData.sowingDate}
                        onChange={(e) => setFormData({...formData, sowingDate: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                    {t('Save Profile')}
                </button>
            </div>
        ) : (
            <div className="space-y-2 text-gray-700">
                <p><strong className="font-semibold text-gray-800">{t('📍 Location:')}</strong> {profile.location || t('Not set')}</p>
                <p><strong className="font-semibold text-gray-800">{t('🌱 Crop:')}</strong> {profile.crop || t('Not set')}</p>
                <p><strong className="font-semibold text-gray-800">{t('🗓️ Sowing Date:')}</strong> {profile.sowingDate || t('Not set')}</p>
                 {!profile.location && (
                    <p className="mt-4 text-sm text-center bg-yellow-100 text-yellow-800 p-3 rounded-lg">
                        {t('Please edit your profile to get personalized tips and a crop calendar.')}
                    </p>
                 )}
            </div>
        )}
      </div>

      {profile.location && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">💡 {t('AI Tip for Your Farm')}</h3>
                {isLoadingTip ? (
                <div className="flex items-center space-x-2 text-gray-500">
                    <Spinner className="w-5 h-5" />
                    <span>{t('Generating your personalized tip...')}</span>
                </div>
                ) : (
                    <p className="text-gray-600 italic">"{personalizedTip}"</p>
                )}
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">📅 {t('Crop Calendar')}</h3>
                <ul className="space-y-2 text-gray-700">
                    <li><strong className="font-semibold text-gray-800">{t('Sowing:')}</strong> {profile.sowingDate || t('Not set')}</li>
                    <li><strong className="font-semibold text-gray-800">{t('Fertilization (Est.):')}</strong> {calculateDate(profile.sowingDate, 30)}</li>
                    <li><strong className="font-semibold text-gray-800">{t('Harvest (Est.):')}</strong> {calculateDate(profile.sowingDate, 90)}</li>
                </ul>
            </div>
        </div>
      )}

    </div>
  );
};

export default MyFarm;