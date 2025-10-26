export enum Tab {
  Home = 'Home',
  CropDiagnosis = 'Crop Diagnosis',
  MarketInsights = 'Market Insights',
  FarmingTips = 'Farming Tips',
  MyReports = 'My Reports',
  MyFarm = 'My Farm',
  CommunityForum = 'Community Forum',
  Chat = 'Voice & Chat',
}

export interface Diagnosis {
  cropName: string;
  issue: string;
  causeAndPrevention: string[];
  recommendedAction: string[];
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface DiagnosisReport {
  id: string;
  imageUrl: string;
  diagnosis: Diagnosis | null;
  timestamp: string;
}

export interface MarketPrice {
  crop: string;
  market: string;
  distance: number;
  price: number;
}

export interface FarmingTip {
    id: string;
    title: string;
    content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  audio?: string;
}

export interface ForumPost {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: { author: string; text: string }[];
}

export interface FarmProfile {
  location: string;
  crop: string;
  sowingDate: string;
}
