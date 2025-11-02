import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { Diagnosis, MarketPrice, Language, AIResponseRotationPlan } from '../types';
import { languageMap } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getLanguageInstruction = (language: Language) => ` Please provide the response in ${languageMap[language]}.`;

export const generateText = async (prompt: string, language: Language): Promise<string> => {
  try {
    const fullPrompt = prompt + getLanguageInstruction(language);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const analyzeCropImage = async (imageFile: File, language: Language): Promise<Diagnosis | null> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `You are KrishiGPT. Analyze this image of a crop. Identify the crop itself, and any disease, pest, or nutrient deficiency. Provide a JSON response with the fields: 'cropName', 'issue', 'causeAndPrevention' (array of strings), 'recommendedAction' (array of strings), and 'severity'. Keep descriptions concise and easy for a farmer to understand. The values for 'cropName', 'issue', 'causeAndPrevention', and 'recommendedAction' MUST be in ${languageMap[language]}. The value for 'severity' MUST be one of 'Mild', 'Moderate', or 'Severe' in English.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [
          { text: prompt }, 
          imagePart
      ]},
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            issue: { type: Type.STRING },
            causeAndPrevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedAction: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe'] },
          },
          required: ['cropName', 'issue', 'causeAndPrevention', 'recommendedAction', 'severity']
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing crop image:", error);
    return null;
  }
};

export const getMarketInfo = async (cropName: string, language: Language): Promise<{ marketData: MarketPrice[], endNote: string } | null> => {
  try {
    const prompt = `You are KrishiGPT, a helpful agricultural assistant. A farmer is looking for market information for their '${cropName}' crop. Provide a JSON response with fields: 'marketData' and 'endNote'. 'marketData' should be an array of 3 fictional but realistic nearby market prices for '${cropName}' in India (objects with 'crop', 'market', 'distance' in km, and 'price' in INR/kg). 'endNote' should be a short, encouraging note. The string values in 'marketData' (specifically the 'crop' and 'market' fields) and the 'endNote' string MUST be in ${languageMap[language]}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  crop: { type: Type.STRING },
                  market: { type: Type.STRING },
                  distance: { type: Type.NUMBER },
                  price: { type: Type.NUMBER },
                },
                required: ['crop', 'market', 'distance', 'price'],
              },
            },
            endNote: { type: Type.STRING },
          },
          required: ['marketData', 'endNote']
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching market info:", error);
    return null;
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // Note: voice might not match all languages perfectly
                  },
              },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;

    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
}

export const generateRotationPlan = async (location: string, soilType: string, pastCrops: string, language: Language): Promise<AIResponseRotationPlan | null> => {
  try {
    const prompt = `You are KrishiGPT. Generate a 3-year crop rotation plan for a farmer in '${location}' with '${soilType}' soil. Their previous crops were '${pastCrops}'. The plan should include Kharif and Rabi seasons for each year. Provide reasons for the crop choices, focusing on improving soil health, pest management, and profitability. Return a JSON response with two fields: 'plan' and 'suggestion'. 'plan' should be an array of objects, where each object has 'year', 'kharif', and 'rabi'. 'suggestion' should be a string explaining the reasoning behind the plan. All string values in the JSON response must be in ${languageMap[language]}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  kharif: { type: Type.STRING },
                  rabi: { type: Type.STRING },
                },
                required: ['year', 'kharif', 'rabi'],
              },
            },
            suggestion: { type: Type.STRING },
          },
          required: ['plan', 'suggestion'],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating rotation plan:", error);
    return null;
  }
}
