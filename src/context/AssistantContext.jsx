import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/aiService';

const AssistantContext = createContext();

const LOCAL_STORAGE_KEY = 'travel_app_ai_chat_history';

export const AssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [activeContext, setActiveContext] = useState({});

  const abortControllerRef = useRef(null);

  // Safe localStorage hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-20)); // Limit to last 20 messages
        }
      }
    } catch (e) {
      console.warn('Failed to parse AI chat history from localStorage:', e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save messages to localStorage safely
  const persistMessages = useCallback((newMessages) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages.slice(-20)));
    } catch (e) {
      // Ignore quota errors
    }
  }, []);

  const openAssistant = useCallback((initialPrompt = '', customContext = null) => {
    if (customContext) {
      setActiveContext(customContext);
    }
    setIsOpen(true);

    if (initialPrompt && typeof initialPrompt === 'string' && initialPrompt.trim()) {
      // Small timeout to allow modal animation to mount
      setTimeout(() => {
        sendMessage(initialPrompt, customContext);
      }, 150);
    }
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    persistMessages([]);
    setIsThinking(false);
    setError(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, [persistMessages]);

  const sendMessage = useCallback(async (text, overrideContext = null) => {
    if (!text || typeof text !== 'string' || !text.trim() || isThinking) {
      return;
    }

    const trimmed = text.trim();
    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...messages, userMessage];
    persistMessages(updatedHistory);
    setIsThinking(true);
    setError(null);

    // Cancel any previous in-flight AI request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const mergedContext = {
      ...activeContext,
      ...(overrideContext || {})
    };

    // Format conversation history for backend (limit to last 8 turns)
    const formattedHistory = messages.slice(-8).map((m) => ({
      role: m.role,
      text: m.content
    }));

    try {
      const res = await sendChatMessage({
        message: trimmed,
        conversation: formattedHistory,
        context: mergedContext,
        signal: controller.signal
      });

      if (res.success && res.data?.reply) {
        const assistantMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          role: 'assistant',
          content: res.data.reply,
          model: res.data.model,
          timestamp: new Date().toISOString()
        };

        persistMessages([...updatedHistory, assistantMessage]);
      } else {
        throw new Error(res.message || 'Unable to generate travel advice.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;

      console.warn('AI Assistant error:', err.message);
      const friendlyError = err.data?.message || err.message || 'Sorry, Vista Holidays Assistant is temporarily unavailable. Please try again.';
      setError(friendlyError);

      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: friendlyError,
        isError: true,
        timestamp: new Date().toISOString()
      };

      persistMessages([...updatedHistory, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [messages, isThinking, activeContext, persistMessages]);

  const retryLastMessage = useCallback(() => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing error message
      const filtered = messages.filter((m) => !m.isError);
      persistMessages(filtered);
      sendMessage(lastUserMsg.content);
    }
  }, [messages, persistMessages, sendMessage]);

  const value = {
    messages,
    isOpen,
    isThinking,
    error,
    activeContext,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    clearChat,
    sendMessage,
    retryLastMessage,
    setActiveContext
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useTravelAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useTravelAssistant must be used within an AssistantProvider');
  }
  return context;
};

export default AssistantContext;
