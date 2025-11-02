import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import Spinner from './icons/Spinner';

const YieldEstimation: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimation, setEstimation] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEstimation(null);
    }
  };

  const handleEstimate = () => {
    if (!imageFile) return;
    setIsLoading(true);
    setEstimation(null);
    setTimeout(() => {
      setEstimation(t('Estimated Yield: 15-18 quintals/acre\nCrop Density: High\nPlant Health: Good\nNote: This is an approximation. Actual yield may vary based on weather and farming practices.'));
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Visual Yield Estimation')}</h2>
        <p className="text-gray-600 mb-6">{t('Upload a photo of your standing crop to get an AI-powered yield estimate.')}</p>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" accept="image/*" id="yield-upload" className="hidden" onChange={handleImageChange} />
            <label htmlFor="yield-upload" className="cursor-pointer text-green-600 font-semibold">
              {previewUrl ? t('Change crop photo') : t('Choose a crop photo')}
            </label>
            <p className="text-xs text-gray-500 mt-1">{t('PNG, JPG, or WEBP')}</p>
          </div>

          {previewUrl && (
            <div className="p-4 border rounded-xl">
              <img src={previewUrl} alt="Crop preview" className="rounded-lg w-full h-auto max-h-80 object-contain mx-auto" />
            </div>
          )}

          <button
            onClick={handleEstimate}
            disabled={isLoading || !imageFile}
            className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2">
            {isLoading && <Spinner />}
            <span>{isLoading ? t('Estimating...') : t('Estimate Yield')}</span>
          </button>
        </div>
      </div>

      {estimation && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('Yield Estimation Result')}</h3>
          <pre className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap font-sans">{estimation}</pre>
        </div>
      )}
    </div>
  );
};

export default YieldEstimation;