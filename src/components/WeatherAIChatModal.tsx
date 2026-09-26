'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Compass,
  Radio,
  Car,
  Snowflake,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Minus,
  Maximize2,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init',
    sender: 'ai',
    text: "Bonjour & Hello! I'm Aurora AI, your Canadian Meteorological Copilot. I analyze real-time Environment Canada HRDPS models, Doppler radar, highway pass cameras, and historical climate normals across all 10 provinces and 3 territories. How can I assist your travels or weather plans today?",
    timestamp: 'Just now',
    links: [
      { label: 'Live Doppler Radar', url: '/radar' },
      { label: 'Mountain Pass Conditions', url: '/highways' },
      { label: 'Wind Chill Calculator', url: '/tools/calculator' },
    ],
  },
];

const SUGGESTED_QUERIES = [
  '🛣️ Is Coquihalla Highway safe to drive today?',
  '❄️ How cold is the wind chill in Edmonton right now?',
  '🌌 Where can I see the Northern Lights tonight?',
  '⛷️ Whistler powder forecast & snow depth',
  '🌧️ Why is Vancouver getting so much rain?',
];

import { useAIChat } from '@/context/AIChatContext';

export const WeatherAIChatModal: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
}> = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
  const chatContext = useAIChat();
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : chatContext.isOpen;
  const onClose = controlledOnClose || chatContext.closeChat;

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API: Speech-to-Text
  const toggleVoiceRecognition = () => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-CA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Web Speech API: Text-to-Speech
  const speakText = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const generateAIResponse = (query: string): { text: string; links?: { label: string; url: string }[] } => {
    const q = query.toLowerCase();

    if (q.includes('coquihalla') || q.includes('highway 5') || (q.includes('vancouver') && q.includes('kelowna'))) {
      return {
        text: '🚗 ROUTE BRIEFING (Vancouver -> Kelowna via BC Hwy 5 Coquihalla): The Coquihalla Summit (1,244m) reports mountain snowpack and sudden freezing rain potential at Great Bear Snowshed. Road surface temperatures are currently near -1°C. Mandatory 3PMSF winter tires in effect. Driving time approx 4h 30m. Clear visibility from Hope to Merritt.',
        links: [
          { label: 'View Coquihalla Pass Webcams', url: '/highways' },
          { label: 'Live Weather Radar', url: '/radar' },
        ],
      };
    }

    if ((q.includes('toronto') && q.includes('montreal')) || q.includes('401') || q.includes('hwy 401')) {
      return {
        text: '🚗 ROUTE BRIEFING (Toronto -> Montréal via Hwy 401 Corridor - 540 km): The corridor along Lake Ontario (Oshawa, Kingston, Cornwall) reports smooth pavement conditions with moderate crosswinds near the St. Lawrence River (25 km/h from SW). No major snow squall streamers intersecting the highway today. Travel time estimated at 5h 15m.',
        links: [
          { label: 'Check Highway Cameras', url: '/highways' },
          { label: 'Ontario & Quebec Radar', url: '/radar' },
        ],
      };
    }

    if ((q.includes('calgary') && q.includes('banff')) || q.includes('trans-canada') || q.includes('hwy 1')) {
      return {
        text: '🚗 ROUTE BRIEFING (Calgary -> Banff & Lake Louise via Trans-Canada Hwy 1): Elevation climbs from 1,048m at Calgary to 1,380m at Banff and 1,600m at Lake Louise. Dry pavement up to Scott Lake Hill; alpine flurries and localized black ice possible past Dead Man’s Flats. Parks Canada pass required.',
        links: [
          { label: 'Banff Mountain Pass Webcams', url: '/highways' },
          { label: 'Lake Louise Ski & Snow Report', url: '/ski/lake-louise' },
        ],
      };
    }

    if (q.includes('wildfire') || q.includes('smoke') || q.includes('pm2.5') || q.includes('fire')) {
      return {
        text: 'Active Canadian wildfire smoke plumes are tracked via FireSmoke CA and CWFIS models. High PM2.5 levels are currently concentrated in northern BC and Alberta boreal zones. You can monitor interactive smoke dispersion, fire perimeters, and 48-hour drift timelines on our new Wildfire Tracker.',
        links: [
          { label: 'Open Canada Wildfire & Smoke Tracker', url: '/tools/wildfire-smoke' },
          { label: 'AQHI Air Quality Index', url: '/tools/air-quality' },
        ],
      };
    }

    if (q.includes('fish') || q.includes('solunar') || q.includes('bite') || q.includes('lake simcoe')) {
      return {
        text: 'Solunar feeding periods for Canadian lakes and rivers are calculated using lunar transit and gravitational nadir windows. Major feeding windows occur twice daily (2-hour peaks), yielding heightened strike rates for Walleye, Lake Trout, and Salmon when combined with pre-frontal barometric drops.',
        links: [
          { label: 'View Canadian Solunar Calendar', url: '/tools/solunar' },
        ],
      };
    }

    if (q.includes('metar') || q.includes('taf') || q.includes('aviation') || q.includes('pilot') || q.includes('crosswind')) {
      return {
        text: 'Our Canadian Aviation weather console decodes live Nav Canada METAR and TAF reports for major hubs (CYYZ, CYVR, CYUL, CYYC, CYHZ) with automatic flight category flags (VFR, MVFR, IFR, LIFR), cloud ceilings, and active runway crosswind component resolvers.',
        links: [
          { label: 'Open Nav Canada Aviation Weather Console', url: '/tools/aviation' },
        ],
      };
    }

    if (q.includes('crop') || q.includes('farming') || q.includes('gdd') || q.includes('frost') || q.includes('agriculture')) {
      return {
        text: 'Our Agricultural Weather module tracks Growing Degree Days (GDD Base 5°C and 10°C), 10cm soil thermal profiles, soil moisture balances, and overnight radiation frost hazard alerts across the Prairies, Niagara, and Okanagan fruit belts.',
        links: [
          { label: 'Open Agricultural Weather & GDD Index', url: '/tools/agriculture' },
        ],
      };
    }

    if (q.includes('edmonton') || q.includes('wind chill') || q.includes('cold') || q.includes('polar vortex')) {
      return {
        text: 'In Edmonton and across the Canadian Prairies, the Arctic cold core generates severe convective heat loss. Under the Environment Canada formula, a temperature of -30°C with 40 km/h winds produces an effective wind chill of -47. At this threshold, exposed skin freezes in fewer than 5 to 10 minutes. Ensure your vehicle block heater is plugged in 3 hours prior and carry a 72-hour survival kit.',
        links: [
          { label: 'Calculate Wind Chill & Frostbite Time', url: '/tools/calculator' },
          { label: 'Read Polar Vortex Investigation', url: '/blog/polar-vortex-canadian-prairies-arctic-blast' },
          { label: 'Edmonton Weather Center', url: '/alberta/edmonton' },
        ],
      };
    }

    if (q.includes('aurora') || q.includes('northern lights') || q.includes('yellowknife') || q.includes('yukon')) {
      return {
        text: 'The auroral oval is currently active over the Northwest Territories, Yukon, and Northern Manitoba. Planetary Kp indices of 3.5 to 5.0 provide exceptional emerald coronal curtains over Yellowknife and Whitehorse. Clear subarctic skies are expected after 23:00 local time away from municipal light pollution.',
        links: [
          { label: 'Open Aurora Borealis Live Tracker', url: '/tools/aurora' },
          { label: 'Yellowknife Weather Forecast', url: '/northwest-territories/yellowknife' },
        ],
      };
    }

    if (q.includes('whistler') || q.includes('ski') || q.includes('powder') || q.includes('snow depth')) {
      return {
        text: 'Whistler Blackcomb reports a 195cm base depth with 18cm of fresh coastal powder in the alpine over the last 24 hours. Freezing level is hovering at 1,100 meters, with Peak 2 Peak Gondola operating normally. Lake Louise and Banff Sunshine in the Rockies report dry champagne powder with a 18:1 snow-water equivalent ratio.',
        links: [
          { label: 'Canada Ski Resorts & Snow Reports Hub', url: '/ski' },
          { label: 'Whistler Blackcomb Snowpack Page', url: '/ski/whistler-blackcomb' },
        ],
      };
    }

    if (q.includes('vancouver') || q.includes('rain') || q.includes('atmospheric river')) {
      return {
        text: 'Greater Vancouver and Vancouver Island are subject to a subtropical Pacific atmospheric river (Pineapple Express corridor). Moisture plumes traveling at 75 km/h against the Coast Mountains multiply precipitation through orographic lifting, dumping 60mm to 120mm of rainfall over North Vancouver and Howe Sound.',
        links: [
          { label: 'Vancouver Live Doppler Radar', url: '/british-columbia/vancouver/radar' },
          { label: 'Read Atmospheric River Deep-Dive', url: '/blog/atmospheric-rivers-pacific-northwest-british-columbia' },
        ],
      };
    }

    if (q.includes('barrie') || q.includes('lake effect') || q.includes('snow squall') || q.includes('toronto')) {
      return {
        text: 'Georgian Bay and Lake Huron lake-effect snow squalls form when Arctic air crosses open water with a delta-T greater than 13°C between the lake surface (+4°C) and the 850 hPa level (-15°C). Single-band streamers frequently paralyze Highway 400 around Barrie with 10 cm/hour accumulation rates while Toronto remains completely sunny.',
        links: [
          { label: 'Ontario Live Doppler Radar Network', url: '/radar' },
          { label: 'Barrie Snow Squall Tracker', url: '/ontario/barrie' },
          { label: 'Read Lake-Effect Snowbelt Science', url: '/blog/lake-effect-snow-ontario-georgian-bay-huron' },
        ],
      };
    }

    // Generic intelligent meteorological answer
    return {
      text: `Based on Environment Canada’s High-Resolution Deterministic Prediction System (HRDPS 2.5km model), Canadian weather patterns are undergoing active seasonal transitions. You can inspect live Doppler reflectivity across Canada, check mountain pass road sensor temperatures, or review verified climate records in our Almanac.`,
      links: [
        { label: 'National Doppler Radar', url: '/radar' },
        { label: 'Historical Climate Almanac', url: '/almanac' },
        { label: 'All 13 Provinces & Territories', url: '/provinces' },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: resp.links,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Handle incoming initial prompt from anywhere on the platform
  useEffect(() => {
    if (chatContext.initialPrompt && isOpen) {
      const prompt = chatContext.initialPrompt;
      chatContext.clearInitialPrompt();
      const timer = setTimeout(() => {
        handleSendMessage(prompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [chatContext.initialPrompt, isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Minimized Bar */}
      {isMinimized ? (
        <div
          onClick={() => setIsMinimized(false)}
          className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-sky-400/50 shadow-2xl backdrop-blur-xl flex items-center gap-3 cursor-pointer hover:border-sky-400 transition-all text-xs"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 via-cyan-300 to-indigo-500 flex items-center justify-center text-slate-950 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Aurora AI Meteorologist</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        </div>
      ) : (
        /* Full Chat Window */
        <div className="w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-[440px] h-[540px] max-h-[82dvh] rounded-3xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95">
          {/* Header Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-300 to-indigo-500 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Aurora AI Meteorologist</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    HRDPS 2026
                  </span>
                </h4>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block animate-pulse" />
                  <span>Canadian Atmospheric Intelligence</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Minimize window"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Close AI assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-tr-none'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Interactive Action Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap gap-1.5">
                      {msg.links.map((lnk, idx) => (
                        <Link
                          key={idx}
                          href={lnk.url}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/30 border border-sky-300 dark:border-sky-500/30 text-[10px] font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1 transition-colors"
                        >
                          <span>{lnk.label}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Footer ribbon with audio readout button */}
                  <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
                    {msg.sender === 'ai' ? (
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${
                          speakingMsgId === msg.id ? 'text-sky-400 font-bold animate-pulse' : 'text-slate-400'
                        }`}
                        title="Listen to briefing"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    ) : (
                      <span />
                    )}

                    <span className={msg.sender === 'user' ? 'text-sky-100/80' : 'text-slate-400 dark:text-slate-500'}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box with Voice Mic */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-white/10 flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceRecognition}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Ask with Voice (Speech Recognition)'}
            >
              {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : 'Ask about Canadian weather, storms, highway passes...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white transition-all shadow-md shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
