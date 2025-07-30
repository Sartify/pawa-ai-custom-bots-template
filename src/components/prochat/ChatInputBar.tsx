"use client";
import React, { useEffect, useRef, useState } from "react";
import { AudioLines, Paperclip, Send } from "lucide-react";
import { MessageFile } from "@/types/Message";
import FileUpload, { FileUploadHandle } from "../ui/FileUpload";
import { useVoiceRecording } from "@/hook/useSpeechToText";

type ChatInputProps = {
  onSend: (message: string, files: MessageFile[]) => void;
  disabled?: boolean;
  showVoiceButton?: boolean;
  onVoiceClick?: () => void;
};

export default function ChatInput({
  onSend,
  disabled = false,
  showVoiceButton = true,
  onVoiceClick,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<MessageFile[]>([]);
  const fileUploadRef = useRef<FileUploadHandle>(null);
  const handleTranscription = (text: string) => {
    setMessage(text);
  };

  const {
    isRecording,
    error,
    startRecording,
    stopRecording,
  } = useVoiceRecording(handleTranscription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim(), files);
    setMessage("");
    setFiles([]);
  };

  const handlePaperclipClick = () => {
    fileUploadRef.current?.triggerFilePicker();
  };

  return (
    <footer className="pb-4 pt-2 px-4 flex flex-col bg-white shrink-0">
      <div className="w-full lg:w-[70%] mx-auto">
        <FileUpload
          ref={fileUploadRef}
          onFilesChange={setFiles}
          disabled={disabled}
          resetTrigger={false}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-[70%] mx-auto flex items-center gap-2"
      >
        <div
          className={`flex items-center flex-1 bg-white border border-[#F3F7F6] shadow-md rounded-lg px-4 py-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <button
            type="button"
            onClick={handlePaperclipClick}
            disabled={disabled}
            className="mr-2 opacity-60 hover:opacity-100"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message TutorAi..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className="h-8 w-8 flex items-center justify-center border border-[#F3F7F6] rounded-md hover:bg-gray-100 transition"
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            <AudioLines
              className={`w-4 h-4 ${
                isRecording ? "animate-pulse text-red-500" : "opacity-60"
              }`}
            />
          </button>
          <button
            type="submit"
            disabled={disabled}
            className="ml-2 h-8 w-8 flex items-center justify-center bg-[#022e79] rounded-md hover:bg-blue-900 transition"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        {showVoiceButton && (
          <button
            type="button"
            className={`h-full aspect-square flex items-center justify-center border border-[#F3F7F6] rounded-lg shadow-md hover:bg-gray-100 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={disabled}
          >
            <img
              src="/assets/icons/moon.svg"
              alt="Voice"
              width={24}
              height={24}
              className="opacity-60"
            />
          </button>
        )}
      </form>
    </footer>
  );
}
