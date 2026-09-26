'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIChatContextType {
  isOpen: boolean;
  openChat: (initialPrompt?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  initialPrompt?: string;
  clearInitialPrompt: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  const openChat = (prompt?: string) => {
    if (prompt) setInitialPrompt(prompt);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const clearInitialPrompt = () => {
    setInitialPrompt(undefined);
  };

  // Keyboard shortcut: Option+A or Alt+A to toggle AI Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        toggleChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AIChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        initialPrompt,
        clearInitialPrompt,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    return {
      isOpen: false,
      openChat: () => {},
      closeChat: () => {},
      toggleChat: () => {},
      initialPrompt: undefined,
      clearInitialPrompt: () => {},
    };
  }
  return context;
}
