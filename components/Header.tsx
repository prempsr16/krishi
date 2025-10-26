import React from 'react';
import { Tab } from '../types';
import TabButton from './TabButton';
import HomeIcon from './icons/HomeIcon';
import LeafIcon from './icons/LeafIcon';
import ChartIcon from './icons/ChartIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import DocumentIcon from './icons/DocumentIcon';
import ChatIcon from './icons/ChatIcon';
import UsersIcon from './icons/UsersIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: Tab.Home, icon: <HomeIcon /> },
    { id: Tab.CropDiagnosis, icon: <LeafIcon /> },
    { id: Tab.MarketInsights, icon: <ChartIcon /> },
    { id: Tab.FarmingTips, icon: <LightbulbIcon /> },
    { id: Tab.MyReports, icon: <DocumentIcon /> },
    { id: Tab.MyFarm, icon: <LocationMarkerIcon /> },
    { id: Tab.CommunityForum, icon: <UsersIcon /> },
    { id: Tab.Chat, icon: <ChatIcon /> },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-green-700">KrishiGPT 🌾</h1>
          </div>
          <nav className="flex space-x-1 md:space-x-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.id}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;