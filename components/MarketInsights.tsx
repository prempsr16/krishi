
import React from 'react';
import type { MarketPrice } from '../types';

const marketData: MarketPrice[] = [
  { crop: 'Tomato', market: 'Pune APMC', distance: 4.2, price: 28 },
  { crop: 'Onion', market: 'Pune APMC', distance: 4.2, price: 15 },
  { crop: 'Potato', market: 'Nashik Central', distance: 200, price: 12 },
  { crop: 'Wheat', market: 'Nagpur Grains', distance: 700, price: 22 },
  { crop: 'Sugarcane', market: 'Kolhapur Sugar', distance: 235, price: 3 },
  { crop: 'Cotton', market: 'Jalgaon Fibers', distance: 400, price: 60 },
];

const openGoogleMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
}

const MarketInsights: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nearby Market Prices</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-2 font-semibold text-gray-600">Crop</th>
                            <th className="px-4 py-2 font-semibold text-gray-600">Market</th>
                            <th className="px-4 py-2 font-semibold text-gray-600">Distance (km)</th>
                            <th className="px-4 py-2 font-semibold text-gray-600">Price (₹/kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.map((item) => (
                            <tr key={`${item.crop}-${item.market}`} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{item.crop}</td>
                                <td className="px-4 py-3">{item.market}</td>
                                <td className="px-4 py-3">{item.distance}</td>
                                <td className="px-4 py-3 font-semibold text-green-700">₹{item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Local Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => openGoogleMaps('nearby market yards')} className="bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2">
                    <span>🗺️</span>
                    <span>Find Nearest Market Yards</span>
                </button>
                 <button onClick={() => openGoogleMaps('fertilizer and pesticide shops near me')} className="bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300 flex items-center justify-center space-x-2">
                    <span>🧪</span>
                    <span>Find Fertilizer/Pesticide Shops</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default MarketInsights;
