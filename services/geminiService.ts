import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { Diagnosis, MarketPrice } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const analyzeCropImage = async (imageFile: File): Promise<Diagnosis | null> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [
          { text: "You are KrishiGPT. Analyze this image of a crop. Identify the crop itself, and any disease, pest, or nutrient deficiency. Provide a JSON response with the fields: 'cropName', 'issue', 'causeAndPrevention' (array of strings), 'recommendedAction' (array of strings), and 'severity' ('Mild', 'Moderate', or 'Severe'). Keep descriptions concise and easy for a farmer to understand." }, 
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

export const getMarketInfo = async (cropName: string): Promise<{ marketData: MarketPrice[], endNote: string } | null> => {
  try {
    const prompt = `You are KrishiGPT, a helpful agricultural assistant. A farmer is looking for market information for their ${cropName} crop. Provide a short, encouraging end note for them. Also, provide a list of 3 fictional but realistic nearby market prices for '${cropName}' in India. Provide a JSON response with the fields: 'marketData' (an array of objects with 'crop', 'market', 'distance' in km, and 'price' in INR/kg) and 'endNote' (a string). Ensure the 'crop' field in marketData matches the requested crop.`;

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
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
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