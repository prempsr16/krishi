import React, { useState, createContext } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import CropDiagnosis from './components/CropDiagnosis';
import MarketInsights from './components/MarketInsights';
import FarmingTips from './components/FarmingTips';
import MyReports from './components/MyReports';
import Chat from './components/Chat';
import CommunityForum from './components/CommunityForum';
import MyFarm from './components/MyFarm';
import { Tab, DiagnosisReport, FarmProfile, Language } from './types';
import { translations } from './translations';

// Import new components
import SoilAnalysis from './components/SoilAnalysis';
import WeatherAlerts from './components/WeatherAlerts';
import GovernmentSchemes from './components/GovernmentSchemes';
import YieldEstimation from './components/YieldEstimation';
import PestOutbreakMap from './components/PestOutbreakMap';
import WaterManagement from './components/WaterManagement';
import MarketPredictor from './components/MarketPredictor';
import EquipmentRental from './components/EquipmentRental';
import CropRotationPlanner from './components/CropRotationPlanner';
import FinancialCalculator from './components/FinancialCalculator';
import DisasterManagement from './components/DisasterManagement';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [reports, setReports] = useState<DiagnosisReport[]>([]);
  const [farmProfile, setFarmProfile] = useState<FarmProfile>({
    location: '',
    crop: '',
    sowingDate: '',
  });
  const [language, setLanguage] = useState<Language>('en');

  const addReport = (report: DiagnosisReport) => {
    setReports(prevReports => [report, ...prevReports]);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Home:
        return <Home setActiveTab={setActiveTab} />;
      case Tab.CropDiagnosis:
        return <CropDiagnosis addReport={addReport} />;
      case Tab.MarketInsights:
        return <MarketInsights />;
      case Tab.FarmingTips:
        return <FarmingTips />;
      case Tab.MyReports:
        return <MyReports reports={reports} />;
      case Tab.MyFarm:
        return <MyFarm profile={farmProfile} setProfile={setFarmProfile} />;
      case Tab.CommunityForum:
        return <CommunityForum />;
      case Tab.Chat:
        return <Chat />;
      // Render new components
      case Tab.SoilAnalysis:
        return <SoilAnalysis />;
      case Tab.WeatherAlerts:
        return <WeatherAlerts />;
      case Tab.GovernmentSchemes:
        return <GovernmentSchemes />;
      case Tab.YieldEstimation:
        return <YieldEstimation />;
      case Tab.PestOutbreakMap:
        return <PestOutbreakMap />;
      case Tab.WaterManagement:
        return <WaterManagement />;
      case Tab.MarketPredictor:
        return <MarketPredictor />;
      case Tab.EquipmentRental:
        return <EquipmentRental />;
      case Tab.CropRotationPlanner:
        return <CropRotationPlanner />;
      case Tab.FinancialCalculator:
        return <FinancialCalculator />;
      case Tab.DisasterManagement:
        return <DisasterManagement />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen font-sans">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {renderContent()}
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
