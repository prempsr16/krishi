import React, { useState, useEffect, useCallback, useContext } from 'react';
import { generateText, generateSpeech } from '../services/geminiService';
import type { FarmingTip } from '../types';
import Spinner from './icons/Spinner';
import { playAudio, stopAudio } from '../services/audioService';
import VolumeUpIcon from './icons/VolumeUpIcon';
import StopIcon from './icons/StopIcon';
import { LanguageContext } from '../App';

const FarmingTips: React.FC = () => {
  const [tips, setTips] = useState<FarmingTip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [playingTipId, setPlayingTipId] = useState<string | null>(null);
  const { language, t } = useContext(LanguageContext);

  const fetchFarmingTips = useCallback(async () => {
    setIsLoading(true);
    const prompt = "Generate 5 distinct farming tips for Kharif and Rabi seasons. Provide a JSON array where each object has 'id', 'title', and 'content'. The content should be a short paragraph.";
    const response = await generateText(prompt, language);
    
    try {
        // Clean the response to make sure it's valid JSON
        const cleanedResponse = response.replace(/```json\n?/, '').replace(/```$/, '');
        const parsedTips = JSON.parse(cleanedResponse);
        setTips(parsedTips);
    } catch (error) {
        console.error("Failed to parse farming tips:", error);
        setTips([{id: 'error', title: 'Error', content: 'Could not fetch tips. Please try again later.'}]);
    }

    setIsLoading(false);
  }, [language]);

  useEffect(() => {
    fetchFarmingTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFarmingTips]);

  const handlePlayAudio = async (tip: FarmingTip) => {
    setAudioLoadingId(tip.id);
    if (playingTipId) {
        stopAudio();
    }
    setPlayingTipId(null);
    const audioData = await generateSpeech(`${tip.title}. ${tip.content}`);
    setAudioLoadingId(null);
    if (audioData) {
      setPlayingTipId(tip.id);
      await playAudio(audioData, () => setPlayingTipId(null));
    } else {
      alert("Could not generate audio.");
    }
  }

  const handleStopAudio = () => {
      stopAudio();
      setPlayingTipId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="w-12 h-12 text-green-500" />
        <span className="ml-4 text-gray-600">{t('Loading farming tips...')}</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Seasonal Farming Tips')}</h2>
      <div className="space-y-6">
        {tips.map((tip) => {
          const isLoadingAudio = audioLoadingId === tip.id;
          const isPlayingAudio = playingTipId === tip.id;
          return (
            <div key={tip.id} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-green-700">{tip.title}</h3>
                    <button 
                        onClick={isPlayingAudio ? handleStopAudio : () => handlePlayAudio(tip)}
                        disabled={isLoadingAudio || (playingTipId !== null && !isPlayingAudio)}
                        className="p-2 rounded-full hover:bg-green-100 transition disabled:opacity-50"
                        aria-label={isPlayingAudio ? 'Stop audio' : 'Play audio'}
                    >
                        {isLoadingAudio ? <Spinner className="w-5 h-5 text-green-600" /> : isPlayingAudio ? <StopIcon className="w-5 h-5 text-red-600" /> : <VolumeUpIcon className="w-5 h-5 text-green-600" />}
                    </button>
                </div>
                <p className="text-gray-600 mt-2">{tip.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FarmingTips;
