import { STORAGE_KEY } from "@/constants/chat";
import { sendMessage as sendMessageService } from "@/services/sendMessageServce";
import { Message, MessageFile } from "@/types/Message";
import { useEffect, useState } from "react";

// Simple message type for internal use
type SimpleMessage = {
  from: "user" | "agent";
  text: string;
};

export function useTutorChat(initialMessages: SimpleMessage[] = []) {
  const [messages, setMessages] = useState<SimpleMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (err) {
        console.error("[WCFChat] Failed to load history:", err);
      }
    }, []);
  
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("[WCFChat] Failed to save history:", err);
      }
    }, [messages]);

  const sendMessage = async (messageText: string, files: MessageFile[]) => {
    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { from: "user", text: messageText }]);

    try {
      const response = await sendMessageService({ message: messageText, files });
      
      // Handle JSON response format
      const responseData = await response.json();
      
      if (responseData.role === "assistant" && responseData.content) {
        setMessages((prev) => [...prev, { from: "agent", text: responseData.content }]);
      } else {
        // Fallback to text response
        const text = await response.text();
        setMessages((prev) => [...prev, { from: "agent", text }]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearHistory
  };
}
