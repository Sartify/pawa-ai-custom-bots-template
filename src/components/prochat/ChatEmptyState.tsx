"use client";
import { MessageFile } from "@/types/Message";
import React from "react";
import { Bot } from "lucide-react";
import ChatInput from "./ChatInputBar";

type EmptyStateProps = {
  onSend: (text: string, files: MessageFile[]) => void;
  disabled?: boolean;
};

export default function TutorEmptyState({ onSend, disabled }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-4 text-center">
      <Bot className="w-16 h-16 text-[#022e79] mb-4" />
      <h1 className="text-xl font-bold mb-4">
        What are you pursuing today?
      </h1>
      <div className="w-full">
        <ChatInput
          onSend={onSend}
          disabled={disabled}
          showVoiceButton={false}
        />
      </div>
      <div className="mt-4 w-[70%] mx-auto">
        <div className="relative bg-white/80 backdrop-blur overflow-hidden">
          <div className="divide-y justify-center divide-gray-200 dark:divide-gray-700">
            {[
              "Help me improve the structure and clarity of my essay on climate change.",
              "Can you explain the Pythagorean Theorem in a way that's easy to understand?",
              "I need a personalized reading schedule to prepare for my literature exam.",
              "Summarize the causes and effects of the French Revolution for a quick review.",
            ].map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSend(suggestion, [])}
                disabled={disabled}
                className="w-full text-center text-sm px-4 py-3 hover:bg-[#F0F7F4] dark:hover:bg-gray-800 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Fade overlay edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-70" />
        </div>
      </div>
    </div>
  );
}
