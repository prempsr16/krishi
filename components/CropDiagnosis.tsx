import React, { useState, useRef, useEffect, useContext } from 'react';
import { analyzeCropImage, generateSpeech, getMarketInfo } from '../services/geminiService';
import type { DiagnosisReport, Diagnosis, MarketPrice } from '../types';
import Spinner from './icons/Spinner';
import { playAudio, stopAudio } from '../services/audioService';
import VolumeUpIcon from './icons/VolumeUpIcon';
import StopIcon from './icons/StopIcon';
import { LanguageContext } from '../App';

interface CropDiagnosisProps {
  addReport: (report: DiagnosisReport) => void;
}

const severityStyles = {
    Mild: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    Moderate: 'bg-orange-100 text-orange-800 border-orange-400',
    Severe: 'bg-red-100 text-red-800 border-red-400',
};

const DiagnosisResult: React.FC<{ 
    diagnosis: Diagnosis, 
    onPlayAudio: (text: string) => void,
    onStopAudio: () => void,
    isAudioLoading: boolean,
    isAudioPlaying: boolean,
}> = ({ diagnosis, onPlayAudio, onStopAudio, isAudioLoading, isAudioPlaying }) => {
    const { t } = useContext(LanguageContext);
    const fullDiagnosisText = `${t('Detected Issue:')} ${diagnosis.issue}. ${t('Severity')} ${t(diagnosis.severity)}. ${t('Cause and Prevention:')} ${diagnosis.causeAndPrevention.join('. ')}. ${t('Recommended Action:')} ${diagnosis.recommendedAction.join('. ')}.`;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">✅ {t('Diagnosis Result')}</h3>
                <p className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full border ${severityStyles[diagnosis.severity]}`}>
                    {t('Severity')}: {t(diagnosis.severity)}
                </p>
              </div>
              <button
                onClick={isAudioPlaying ? onStopAudio : () => onPlayAudio(fullDiagnosisText)}
                disabled={isAudioLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400">
                {isAudioLoading ? <Spinner className="w-5 h-5" /> : isAudioPlaying ? <StopIcon className="w-5 h-5"/> : <VolumeUpIcon />}
                <span>{isAudioLoading ? t('Loading...') : isAudioPlaying ? t('Stop') : t('Listen')}</span>
              </button>
            </div>

            <div>
                <h4 className="font-semibold text-lg text-green-700">{t('Detected Issue:')}</h4>
                <p className="text-gray-600">{diagnosis.issue} on {diagnosis.cropName}</p>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-green-700">{t('Cause and Prevention:')}</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {diagnosis.causeAndPrevention.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-green-700">{t('Recommended Action:')}</h4>
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

const MarketInfoResult: React.FC<{ marketData: MarketPrice[], endNote: string }> = ({ marketData, endNote }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">📊 {t('Market Info')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-2 font-semibold text-gray-600">{t('Market')}</th>
                            <th className="px-4 py-2 font-semibold text-gray-600">{t('Distance')}</th>
                            <th className="px-4 py-2 font-semibold text-gray-600">{t('Price/kg')}</th>
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
                <span>{t('View on Google Maps')}</span>
            </button>
            <div className="pt-4 border-t mt-4">
                <p className="text-gray-600 italic">"{endNote}"</p>
            </div>
        </div>
    )
};


const CropDiagnosis: React.FC<CropDiagnosisProps> = ({ addReport }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [marketInfo, setMarketInfo] = useState<MarketPrice[] | null>(null);
  const [endNote, setEndNote] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { language, t } = useContext(LanguageContext);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const closeCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setStream(null);
  };

  useEffect(() => {
    // Cleanup function to close camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
      setError(null);
      setMarketInfo(null);
      setEndNote(null);
      closeCamera();
    }
  };

  const openCamera = async () => {
    setError(null);
    setPreviewUrl(null);
    setImageFile(null);
    setDiagnosis(null);

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setIsCameraOpen(true);
    } catch (err) {
        console.error("Error accessing camera:", err);
        let message = t('Could not access camera. Please check browser permissions.');
        if (err instanceof DOMException) {
            if (err.name === "NotAllowedError") {
                message = t('Camera access was denied. Please allow camera permissions in your browser settings.');
            } else if (err.name === "NotFoundError") {
                message = t('No camera was found on this device.');
            }
        }
        setError(message);
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
                    closeCamera();
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
    handleStopAudio(); // Stop any previous audio

    const result = await analyzeCropImage(imageFile, language);
    
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
          const marketResult = await getMarketInfo(result.cropName, language);
          if (marketResult) {
              setMarketInfo(marketResult.marketData);
              setEndNote(marketResult.endNote);
          }
      }
    } else {
      setError(t('Could not analyze the image. Please try another one.'));
    }
    setIsLoading(false);
  };

  const handlePlayAudio = async (text: string) => {
    setIsAudioLoading(true);
    setIsAudioPlaying(false);
    const audioData = await generateSpeech(text);
    setIsAudioLoading(false);
    if(audioData) {
        setIsAudioPlaying(true);
        await playAudio(audioData, () => setIsAudioPlaying(false));
    } else {
        alert("Could not generate audio.");
    }
  }
  
  const handleStopAudio = () => {
    stopAudio();
    setIsAudioPlaying(false);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Upload or Capture Photo')}</h2>
            {isCameraOpen ? (
                <div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-gray-900 h-64 object-cover"></video>
                    <button onClick={handleCapture} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition">
                        {t('Capture Photo')}
                    </button>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" accept="image/*" id="crop-upload" className="hidden" onChange={handleImageChange} />
                        <label htmlFor="crop-upload" className="cursor-pointer text-green-600 font-semibold">
                            {previewUrl ? t('Change photo') : t('Choose from files')}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{t('PNG, JPG, or WEBP')}</p>
                    </div>
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 font-semibold">{t('OR')}</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <button onClick={isCameraOpen ? closeCamera : openCamera} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2">
                        <span>📷</span>
                        <span>{isCameraOpen ? t('Close Camera') : t('Use Camera')}</span>
                    </button>
                </div>
            )}
             {isCameraOpen && (
                 <button onClick={closeCamera} className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-1">
                    {t('Cancel')}
                </button>
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
                <span>{isLoading ? t('Analyzing...') : t('Diagnose Now')}</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {isLoading && (
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <Spinner className="w-12 h-12 text-green-500" />
                <p className="mt-4 text-gray-600 font-semibold">{t('Our AI is analyzing your crop... please wait.')}</p>
            </div>
          )}
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
          {diagnosis && <DiagnosisResult diagnosis={diagnosis} onPlayAudio={handlePlayAudio} onStopAudio={handleStopAudio} isAudioLoading={isAudioLoading} isAudioPlaying={isAudioPlaying} />}
          {marketInfo && endNote && <MarketInfoResult marketData={marketInfo} endNote={endNote} />}
        </div>

      </div>
    </div>
  );
};

export default CropDiagnosis;