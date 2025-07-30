import { useState, useCallback } from 'react';
import { Message } from '@/types/Message';

interface ChatOptions {
  model: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  const [options, setOptions] = useState<ChatOptions>({ model: 'gpt-3.5-turbo' });
  const [isReceivingChunks, setIsReceivingChunks] = useState(false);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);
  const [webSearchingMessageId, setWebSearchingMessageId] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSendMessage = useCallback(async (
    text: string,
    model: string,
    files?: File[],
    isResubmit?: boolean,
    regenerateId?: string
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isGenerating: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);
    setIsReceivingChunks(true);

    // Simulate streaming response
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: 'This is a simulated response from the AI. In a real implementation, this would be the streaming response from your API.', isGenerating: false }
          : msg
      ));
      setIsStreaming(false);
      setIsReceivingChunks(false);
    }, 2000);
  }, []);

  const handleResubmitMessage = useCallback((
    newContent: string,
    userMessageId: string,
    assistantMessageId: string
  ) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === userMessageId) {
        return { ...msg, content: newContent };
      }
      if (msg.id === assistantMessageId) {
        return { ...msg, content: '', isGenerating: true };
      }
      return msg;
    }));

    // Simulate regeneration
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'This is a simulated regenerated response.', isGenerating: false }
          : msg
      ));
    }, 1500);
  }, []);

  const handleRegenerateResponse = useCallback((messageId: string) => {
    setRegeneratingMessageId(messageId);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: '', isGenerating: true }
        : msg
    ));

    // Simulate regeneration
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: 'This is a simulated regenerated response.', isGenerating: false }
          : msg
      ));
      setRegeneratingMessageId(null);
    }, 1500);
  }, []);

  const stopGeneration = useCallback(() => {
    setIsStreaming(false);
    setIsReceivingChunks(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isGenerating: false })));
  }, []);

  const handleVoiceToVoiceMessage = useCallback(() => {
    setIsVoiceMode(!isVoiceMode);
  }, [isVoiceMode]);

  return {
    messages,
    isStreaming,
    clearMessages,
    regeneratingMessageId,
    handleSendMessage,
    handleResubmitMessage,
    handleRegenerateResponse,
    options,
    setOptions,
    stopGeneration,
    isReceivingChunks,
    hasPendingUploads,
    setHasPendingUploads,
    webSearchingMessageId,
    handleVoiceToVoiceMessage,
    isVoiceMode,
  };
}; 