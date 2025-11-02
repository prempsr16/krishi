import React, { useContext } from 'react';
import { LanguageContext } from '../App';

const WeatherAlerts: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const forecastData = [
    { day: t('Mon'), icon: '☀️', temp: '32°C' },
    { day: t('Tue'), icon: '🌤️', temp: '33°C' },
    { day: t('Wed'), icon: '☁️', temp: '31°C' },
    { day: t('Thu'), icon: '🌧️', temp: '28°C' },
    { day: t('Fri'), icon: '🌧️', temp: '27°C' },
    { day: t('Sat'), icon: ' stormy', temp: '26°C' },
    { day: t('Sun'), icon: '🌤️', temp: '30°C' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('7-Day Weather Forecast')}</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 text-center">
          {forecastData.map(item => (
            <div key={item.day} className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold">{item.day}</p>
              <p className="text-3xl my-2">{item.icon}</p>
              <p className="font-bold text-lg">{item.temp}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('AI-Powered Actionable Insights')}</h2>
        <div className="space-y-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
            <p className="font-bold">{t('Upcoming Rain (Thu, Fri)')}</p>
            <p>{t('Heavy rainfall is expected. It is a good time to reinforce your greenhouse and check drainage channels. Avoid spraying pesticides as they will be washed away.')}</p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
            <p className="font-bold">{t('High Humidity Alert')}</p>
            <p>{t('Humidity will be over 85% for the next 3 days. Monitor crops for fungal diseases like blight and mildew.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;