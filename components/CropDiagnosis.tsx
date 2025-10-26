import React, { useState, useRef, useEffect } from 'react';
import { analyzeCropImage, generateSpeech, getMarketInfo } from '../services/geminiService';
import type { DiagnosisReport, Diagnosis, MarketPrice } from '../types';
import Spinner from './icons/Spinner';
import { playAudio } from '../services/audioService';
import VolumeUpIcon from './icons/VolumeUpIcon';

interface CropDiagnosisProps {
  addReport: (report: DiagnosisReport) => void;
}

const severityStyles = {
    Mild: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    Moderate: 'bg-orange-100 text-orange-800 border-orange-400',
    Severe: 'bg-red-100 text-red-800 border-red-400',
};

const DiagnosisResult: React.FC<{ diagnosis: Diagnosis, onPlayAudio: (text: string) => void, isAudioLoading: boolean }> = ({ diagnosis, onPlayAudio, isAudioLoading }) => {
    const fullDiagnosisText = `Issue detected: ${diagnosis.issue}. Severity is ${diagnosis.severity}. Here is the cause and prevention advice: ${diagnosis.causeAndPrevention.join('. ')}. Recommended action: ${diagnosis.recommendedAction.join('. ')}.`;
    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">✅ Diagnosis Result</h3>
                <p className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full border ${severityStyles[diagnosis.severity]}`}>
                    Severity: {diagnosis.severity}
                </p>
              </div>
              <button
                onClick={() => onPlayAudio(fullDiagnosisText)}
                disabled={isAudioLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400">
                {isAudioLoading ? <Spinner className="w-5 h-5" /> : <VolumeUpIcon />}
                <span>Listen</span>
              </button>
            </div>

            <div>
                <h4 className="font-semibold text-lg text-green-700">Detected Issue:</h4>
                <p className="text-gray-600">{diagnosis.issue} on {diagnosis.cropName}</p>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-green-700">Cause and Prevention:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {diagnosis.causeAndPrevention.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-green-700">Recommended Action:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {diagnosis.recommendedAction.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
};

const openGoogleMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
}

const MarketInfoResult: React.FC<{ marketData: MarketPrice[], endNote: string }> = ({ marketData, endNote }) => (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">📊 Market Info</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-gray-600">Market</th>
                        <th className="px-4 py-2 font-semibold text-gray-600">Distance</th>
                        <th className="px-4 py-2 font-semibold text-gray-600">Price/kg</th>
                    </tr>
                </thead>
                <tbody>
                    {marketData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{item.market}</td>
                            <td className="px-4 py-3">{item.distance} km</td>
                            <td className="px-4 py-3 font-semibold text-green-700">₹{item.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button 
            onClick={() => openGoogleMaps('nearby market yards')} 
            className="w-full mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2"
        >
            <span>🗺️</span>
            <span>View on Google Maps</span>
        </button>
        <div className="pt-4 border-t mt-4">
            <p className="text-gray-600 italic">"{endNote}"</p>
        </div>
    </div>
);


const CropDiagnosis: React.FC<CropDiagnosisProps> = ({ addReport }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [marketInfo, setMarketInfo] = useState<MarketPrice[] | null>(null);
  const [endNote, setEndNote] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleCloseCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setStream(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
      setError(null);
      setMarketInfo(null);
      setEndNote(null);
      handleCloseCamera();
    }
  };

  const handleOpenCamera = async () => {
    setError(null);
    setPreviewUrl(null);
    setImageFile(null);
    setDiagnosis(null);
    
    if (isCameraOpen) {
        handleCloseCamera();
        return;
    }

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setIsCameraOpen(true);
    } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check browser permissions.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    handleCloseCamera();
                }
            }, 'image/jpeg');
        }
    }
  };

  const handleDiagnose = async () => {
    if (!imageFile || !previewUrl) return;
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);
    setMarketInfo(null);
    setEndNote(null);

    const result = await analyzeCropImage(imageFile);
    
    if (result) {
      setDiagnosis(result);
      const newReport: DiagnosisReport = {
        id: new Date().toISOString(),
        imageUrl: previewUrl,
        diagnosis: result,
        timestamp: new Date().toLocaleString(),
      };
      addReport(newReport);

      if (result.cropName) {
          const marketResult = await getMarketInfo(result.cropName);
          if (marketResult) {
              setMarketInfo(marketResult.marketData);
              setEndNote(marketResult.endNote);
          }
      }
    } else {
      setError("Could not analyze the image. Please try another one.");
    }
    setIsLoading(false);
  };

  const handlePlayAudio = async (text: string) => {
    setIsAudioLoading(true);
    const audioData = await generateSpeech(text);
    if(audioData) {
        await playAudio(audioData);
    } else {
        alert("Could not generate audio.");
    }
    setIsAudioLoading(false);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload or Capture Photo</h2>
            {isCameraOpen ? (
                <div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-gray-900 h-64 object-cover"></video>
                    <button onClick={handleCapture} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition">
                        Capture Photo
                    </button>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <button onClick={handleCloseCamera} className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-1">
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" accept="image/*" id="crop-upload" className="hidden" onChange={handleImageChange} />
                        <label htmlFor="crop-upload" className="cursor-pointer text-green-600 font-semibold">
                            {previewUrl ? 'Change photo' : 'Choose from files'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP</p>
                    </div>
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 font-semibold">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <button onClick={handleOpenCamera} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2">
                        <span>📷</span>
                        <span>Use Camera</span>
                    </button>
                </div>
            )}
          </div>

          {previewUrl && !isCameraOpen && (
            <div className="bg-white p-4 rounded-xl shadow-md">
              <img src={previewUrl} alt="Crop preview" className="rounded-lg w-full h-auto max-h-80 object-contain" />
              <button 
                onClick={handleDiagnose} 
                disabled={isLoading}
                className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center space-x-2">
                {isLoading && <Spinner />}
                <span>{isLoading ? 'Analyzing...' : 'Diagnose Now'}</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {isLoading && (
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <Spinner className="w-12 h-12 text-green-500" />
                <p className="mt-4 text-gray-600 font-semibold">Our AI is analyzing your crop... please wait.</p>
            </div>
          )}
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
          {diagnosis && <DiagnosisResult diagnosis={diagnosis} onPlayAudio={handlePlayAudio} isAudioLoading={isAudioLoading} />}
          {marketInfo && endNote && <MarketInfoResult marketData={marketInfo} endNote={endNote} />}
        </div>

      </div>
    </div>
  );
};

export default CropDiagnosis;