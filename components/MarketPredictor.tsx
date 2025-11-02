import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const priceData = [
  { name: 'Jan', price: 25 },
  { name: 'Feb', price: 28 },
  { name: 'Mar', price: 22 },
  { name: 'Apr', price: 30 },
  { name: 'May', price: 35 },
  { name: 'Jun', price: 32 },
];

const MarketPredictor: React.FC = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Market Price Predictor')}</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('Select Crop')}</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500">
                <option>{t('Tomato')}</option>
                <option>{t('Onion')}</option>
                <option>{t('Wheat')}</option>
            </select>
        </div>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[10, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#16a34a" name={t('Price (₹/kg)')} strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('AI Price Prediction (Next 30 Days)')}</h3>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            <p className="font-bold">{t('Prediction: Slight Increase')}</p>
            <p>{t('Our AI predicts a 5-10% increase in Tomato prices over the next month due to increased demand and stable supply. Consider holding your stock for another week for potentially better returns.')}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketPredictor;