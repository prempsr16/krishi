import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { LiveServerMessage, Modality, Blob } from '@google/genai';
import { ai } from '../services/geminiService';
import { encode, decode, decodeAudioData } from '../services/audioService';
import { LanguageContext } from '../App';
import Spinner from './icons/Spinner';
import MicrophoneIcon from './icons/MicrophoneIcon';
import StopIcon from './icons/StopIcon';

// FIX: The LiveSession type is not exported from the SDK, so we define it from the return type of ai.live.connect to fix the import error.
type LiveSession = Awaited<ReturnType<typeof ai.live.connect>>;

type SessionState = 'inactive' | 'connecting' | 'active' | 'error' | 'stopped';
type TranscriptEntry = {
    id: number;
    speaker: 'You' | 'KrishiGPT';
    text: string;
};

const Chat: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [sessionState, setSessionState] = useState<SessionState>('inactive');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    
    const sessionRef = useRef<Promise<LiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [transcript]);
    
    const stopSession = useCallback(async () => {
        if (sessionRef.current) {
            const session = await sessionRef.current;
            session.close();
            sessionRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
            scriptProcessorRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
        }
        setSessionState('stopped');
    }, []);
    
    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);
    
    const startSession = async () => {
        setTranscript([]);
        setSessionState('connecting');

        try {
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            sessionRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: async () => {
                        setSessionState('active');
                        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionRef.current) {
                                sessionRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            setIsAISpeaking(true);
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const userTurn = currentInputTranscriptionRef.current.trim();
                            const aiTurn = currentOutputTranscriptionRef.current.trim();
                            
                            setTranscript(prev => {
                                let newTranscript = [...prev];
                                if (userTurn) newTranscript.push({ id: Date.now(), speaker: 'You', text: userTurn });
                                if (aiTurn) newTranscript.push({ id: Date.now() + 1, speaker: 'KrishiGPT', text: aiTurn });
                                return newTranscript;
                            });

                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                            setIsAISpeaking(false);
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.addEventListener('ended', () => {
                                sources.delete(source);
                            });
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                        
                        if (message.serverContent?.interrupted) {
                             for (const source of sources.values()) {
                                source.stop();
                                sources.delete(source);
                            }
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setSessionState('error');
                        stopSession();
                    },
                    onclose: () => {
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are KrishiGPT, a friendly and helpful agricultural assistant for farmers in India. Keep your responses friendly, concise, and to the point. Speak clearly.',
                },
            });
        } catch (error) {
            console.error('Failed to start session:', error);
            setSessionState('error');
        }
    };
    
    const getStatusText = () => {
        switch(sessionState) {
            case 'inactive': return t('Start Live Assistance');
            case 'connecting': return t('Connecting...');
            case 'active': return isAISpeaking ? t('Speaking...') : t('Listening...');
            case 'stopped': return t('Session ended.');
            case 'error': return t('An error occurred.');
            default: return '';
        }
    }

    return (
        <div className="p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col items-center">
            <div className="w-full max-w-3xl flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white rounded-t-xl shadow-inner p-4 space-y-4">
                    {transcript.map((entry) => (
                        <div key={entry.id} className={`flex items-start gap-3 ${entry.speaker === 'You' ? 'justify-end' : ''}`}>
                            {entry.speaker === 'KrishiGPT' && <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">AI</div>}
                            <div className={`max-w-md p-3 rounded-lg ${entry.speaker === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="font-semibold">{t(entry.speaker)}</p>
                                <p>{entry.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={transcriptEndRef} />
                </div>
                <div className="bg-white rounded-b-xl shadow-inner p-4 border-t flex flex-col items-center justify-center space-y-4">
                     <p className="text-gray-600 font-medium h-6">{getStatusText()}</p>
                    <button
                        onClick={sessionState === 'active' || sessionState === 'connecting' ? stopSession : startSession}
                        disabled={sessionState === 'connecting'}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 disabled:opacity-50
                            ${sessionState === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {sessionState === 'connecting' ? <Spinner className="w-10 h-10 text-white" /> : 
                         sessionState === 'active' ? <StopIcon className="w-10 h-10 text-white" /> :
                         <MicrophoneIcon className="w-10 h-10 text-white" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;