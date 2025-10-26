
import React, { useState, useEffect, useCallback } from 'react';
import { Tab } from '../types';
import { generateText } from '../services/geminiService';
import Spinner from './icons/Spinner';

interface HomeProps {
  setActiveTab: (tab: Tab) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const [dailyTip, setDailyTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState<boolean>(true);

  const fetchDailyTip = useCallback(async () => {
    setLoadingTip(true);
    const tip = await generateText("Provide a single, short, and encouraging farming tip of the day for a farmer in India.");
    setDailyTip(tip);
    setLoadingTip(false);
  }, []);

  useEffect(() => {
    fetchDailyTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-gradient-to-r from-green-500 to-lime-500 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold">Welcome back, Farmer!</h2>
        <p className="mt-2 text-lg">Your trusted agricultural assistant is here to help you grow more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => setActiveTab(Tab.CropDiagnosis)} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="text-4xl mb-3">🌿</div>
          <h3 className="text-xl font-semibold text-gray-800">Upload Crop Photo</h3>
          <p className="text-gray-500 mt-1">Get instant diagnosis for diseases.</p>
        </button>
        <button onClick={() => setActiveTab(Tab.Chat)} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-xl font-semibold text-gray-800">Ask a Question</h3>
          <p className="text-gray-500 mt-1">Get answers to your farming queries.</p>
        </button>
        <button onClick={() => setActiveTab(Tab.MarketInsights)} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="text-xl font-semibold text-gray-800">View Market Rates</h3>
          <p className="text-gray-500 mt-1">Check the latest prices for your crops.</p>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">💡 Daily Tip</h3>
            {loadingTip ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <Spinner className="w-5 h-5" />
                <span>Generating your daily tip...</span>
              </div>
            ) : (
                <p className="text-gray-600 italic">"{dailyTip}"</p>
            )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">🌦️ Weather Summary</h3>
            <div className="flex justify-around items-center text-center">
                <div>
                    <div className="text-4xl">☀️</div>
                    <p className="font-bold text-2xl text-yellow-500">32°C</p>
                    <p className="text-gray-500">Temperature</p>
                </div>
                 <div>
                    <div className="text-4xl">💧</div>
                    <p className="font-bold text-2xl text-blue-500">75%</p>
                    <p className="text-gray-500">Humidity</p>
                </div>
                 <div>
                    <div className="text-4xl">🌧️</div>
                    <p className="font-bold text-2xl text-gray-600">10%</p>
                    <p className="text-gray-500">Rainfall</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
