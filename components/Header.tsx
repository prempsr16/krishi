import React, { useState, useContext, useRef, useEffect } from 'react';
import { Tab, languageMap, Language } from '../types';
import TabButton from './TabButton';
import HomeIcon from './icons/HomeIcon';
import LeafIcon from './icons/LeafIcon';
import ChartIcon from './icons/ChartIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import DocumentIcon from './icons/DocumentIcon';
import ChatIcon from './icons/ChatIcon';
import UsersIcon from './icons/UsersIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import GlobeIcon from './icons/GlobeIcon';
import { LanguageContext } from '../App';
import SoilIcon from './icons/SoilIcon';
import WeatherIcon from './icons/WeatherIcon';
import GovernmentIcon from './icons/GovernmentIcon';
import YieldIcon from './icons/YieldIcon';
import PestIcon from './icons/PestIcon';
import WaterDropIcon from './icons/WaterDropIcon';
import PredictionIcon from './icons/PredictionIcon';
import TractorIcon from './icons/TractorIcon';
import RotationIcon from './icons/RotationIcon';
import CalculatorIcon from './icons/CalculatorIcon';
import DotsVerticalIcon from './icons/DotsVerticalIcon';
import AlertIcon from './icons/AlertIcon';


interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const moreMenuDesktopRef = useRef<HTMLDivElement>(null);
  const moreMenuMobileRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);


  const tabs = [
    { id: Tab.Home, icon: <HomeIcon /> },
    { id: Tab.CropDiagnosis, icon: <LeafIcon /> },
    { id: Tab.Chat, icon: <ChatIcon /> },
    { id: Tab.MyFarm, icon: <LocationMarkerIcon /> },
    { id: Tab.MarketInsights, icon: <ChartIcon /> },
    { id: Tab.FarmingTips, icon: <LightbulbIcon /> },
    { id: Tab.MyReports, icon: <DocumentIcon /> },
    { id: Tab.CommunityForum, icon: <UsersIcon /> },
    { id: Tab.DisasterManagement, icon: <AlertIcon /> },
    { id: Tab.SoilAnalysis, icon: <SoilIcon /> },
    { id: Tab.WeatherAlerts, icon: <WeatherIcon /> },
    { id: Tab.GovernmentSchemes, icon: <GovernmentIcon /> },
    { id: Tab.YieldEstimation, icon: <YieldIcon /> },
    { id: Tab.PestOutbreakMap, icon: <PestIcon /> },
    { id: Tab.WaterManagement, icon: <WaterDropIcon /> },
    { id: Tab.MarketPredictor, icon: <PredictionIcon /> },
    { id: Tab.EquipmentRental, icon: <TractorIcon /> },
    { id: Tab.CropRotationPlanner, icon: <RotationIcon /> },
    { id: Tab.FinancialCalculator, icon: <CalculatorIcon /> },
  ];
  
  // Tabs visible on larger screens
  const mainTabs = tabs.slice(0, 4);
  // Tabs hidden in "More" dropdown on larger screens
  const moreTabs = tabs.slice(4);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  }

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsMoreDropdownOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      const isOutsideMoreMenu = 
        (!moreMenuDesktopRef.current || !moreMenuDesktopRef.current.contains(target)) &&
        (!moreMenuMobileRef.current || !moreMenuMobileRef.current.contains(target));

      if (isOutsideMoreMenu) {
        setIsMoreDropdownOpen(false);
      }
      
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-green-700">KrishiGPT 🌾</h1>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <nav className="hidden lg:flex space-x-1 md:space-x-2">
              {mainTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  label={t(tab.id)}
                  icon={tab.icon}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                />
              ))}
            </nav>
            {/* More Menu for Desktop */}
            <div className="hidden lg:block relative" ref={moreMenuDesktopRef}>
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isMoreDropdownOpen ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-green-100 hover:text-green-800'}`}
              >
                <DotsVerticalIcon className="w-5 h-5"/>
                <span className="hidden md:inline">{t('More')}</span>
              </button>
              {isMoreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                    {moreTabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab.id)}
                          className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm ${activeTab === tab.id ? 'bg-green-100 text-green-800' : 'text-gray-700'} hover:bg-gray-100`}
                        >
                            {tab.icon}
                            <span>{t(tab.id)}</span>
                        </button>
                    ))}
                </div>
              )}
            </div>
             {/* More Menu for Mobile/Tablet */}
            <div className="lg:hidden relative" ref={moreMenuMobileRef}>
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <DotsVerticalIcon className="w-6 h-6 text-gray-600" />
              </button>
               {isMoreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                    {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabClick(tab.id)}
                          className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm ${activeTab === tab.id ? 'bg-green-100 text-green-800' : 'text-gray-700'} hover:bg-gray-100`}
                        >
                            {tab.icon}
                            <span>{t(tab.id)}</span>
                        </button>
                    ))}
                </div>
              )}
            </div>


            <div className="relative" ref={langMenuRef}>
              <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Change language"
              >
                  <GlobeIcon className="w-6 h-6 text-gray-600"/>
              </button>
              {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-20">
                      {(Object.keys(languageMap) as Language[]).map(lang => (
                           <button
                              key={lang}
                              onClick={() => handleLanguageChange(lang)}
                              className={`block w-full text-left px-4 py-2 text-sm ${language === lang ? 'bg-green-100 text-green-800' : 'text-gray-700'} hover:bg-gray-100`}
                          >
                              {languageMap[lang]}
                          </button>
                      ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;