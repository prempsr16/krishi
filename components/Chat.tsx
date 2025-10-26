
import React, { useState, useRef, useEffect } from 'react';
import { generateText, generateSpeech } from '../services/geminiService';
import type { ChatMessage } from '../types';
import Spinner from './icons/Spinner';
import { playAudio } from '../services/audioService';
import VolumeUpIcon from './icons/VolumeUpIcon';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await generateText(`You are KrishiGPT. The user asks: "${input}". Provide a helpful and friendly answer.`);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  const handlePlayAudio = async (message: ChatMessage) => {
    setAudioLoadingId(message.id);
    const audioData = await generateSpeech(message.text);
    if(audioData) {
        await playAudio(audioData);
    } else {
        alert("Could not generate audio.");
    }
    setAudioLoadingId(null);
  }

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 overflow-y-auto bg-white rounded-t-xl shadow-inner p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">AI</div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p>{msg.text}</p>
            </div>
            {msg.sender === 'ai' && (
                <button
                    onClick={() => handlePlayAudio(msg)}
                    disabled={audioLoadingId === msg.id}
                    className="p-2 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                >
                    {audioLoadingId === msg.id ? <Spinner className="w-5 h-5 text-gray-600" /> : <VolumeUpIcon className="w-5 h-5 text-gray-600" />}
                </button>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">AI</div>
              <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                <Spinner className="w-5 h-5" />
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white rounded-b-xl shadow-inner p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask KrishiGPT a question..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
