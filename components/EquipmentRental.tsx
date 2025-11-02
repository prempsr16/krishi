import React, { useContext } from 'react';
import { LanguageContext } from '../App';

const EquipmentRental: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const equipment = [
    { name: t('Tractor'), owner: t('Shyam Farm Services'), price: '₹1200/hour', location: t('Pune, 5km away'), image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: t('Rotavator'), owner: t('Laxmi Rentals'), price: '₹800/hour', location: t('Nashik, 15km away'), image: 'https://images.pexels.com/photos/1089552/pexels-photo-1089552.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: t('Harvester'), owner: t('Ganesh Agro'), price: '₹2500/acre', location: t('Baramati, 25km away'), image: 'https://images.pexels.com/photos/2132145/pexels-photo-2132145.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Farm Equipment Rental')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map(item => (
          <div key={item.name} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.owner}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">{item.price}</p>
              <p className="text-sm text-gray-500 mt-1">{item.location}</p>
              <button className="w-full mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">{t('Contact Owner')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentRental;