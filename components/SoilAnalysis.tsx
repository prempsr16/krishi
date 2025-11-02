import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import Spinner from './icons/Spinner';

const SoilAnalysis: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!imageFile) return;
    setIsLoading(true);
    setAnalysisResult(null);
    // Mock AI analysis
    setTimeout(() => {
      setAnalysisResult(
        t('Soil Type: Loamy Sand\n\n') +
        t('pH Level: 6.8 (Slightly Acidic)\n\n') +
        t('Nutrient Analysis:\n- Nitrogen (N): Moderate\n- Phosphorus (P): Low\n- Potassium (K): High\n\n') +
        t('Recommendations:\n- Add compost to improve phosphorus levels.\n- Consider a nitrogen-rich fertilizer for the next crop cycle.')
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('AI-Powered Soil Health Analysis')}</h2>
        <p className="text-gray-600 mb-6">{t('Upload a photo of your soil to get an instant analysis of its health and composition.')}</p>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" accept="image/*" id="soil-upload" className="hidden" onChange={handleImageChange} />
            <label htmlFor="soil-upload" className="cursor-pointer text-green-600 font-semibold">
              {previewUrl ? t('Change soil photo') : t('Choose a soil photo')}
            </label>
            <p className="text-xs text-gray-500 mt-1">{t('PNG, JPG, or WEBP')}</p>
          </div>

          {previewUrl && (
            <div className="p-4 border rounded-xl">
              <img src={previewUrl} alt="Soil preview" className="rounded-lg w-full h-auto max-h-80 object-contain mx-auto" />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !imageFile}
            className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2">
            {isLoading && <Spinner />}
            <span>{isLoading ? t('Analyzing Soil...') : t('Analyze Soil Health')}</span>
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('Soil Analysis Result')}</h3>
          <pre className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap font-sans">{analysisResult}</pre>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;