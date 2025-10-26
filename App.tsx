import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import CropDiagnosis from './components/CropDiagnosis';
import MarketInsights from './components/MarketInsights';
import FarmingTips from './components/FarmingTips';
import MyReports from './components/MyReports';
import Chat from './components/Chat';
import CommunityForum from './components/CommunityForum';
import MyFarm from './components/MyFarm';
import { Tab, DiagnosisReport, FarmProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [reports, setReports] = useState<DiagnosisReport[]>([]);
  const [farmProfile, setFarmProfile] = useState<FarmProfile>({
    location: '',
    crop: '',
    sowingDate: '',
  });

  const addReport = (report: DiagnosisReport) => {
    setReports(prevReports => [report, ...prevReports]);
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
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;