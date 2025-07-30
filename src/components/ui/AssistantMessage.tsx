"use client";
import React from "react";
import Image from "next/image";
import Markdown from "@/components/markdown";
import { ActionButton } from "./ActionButton";
import {
  Copy,
  Check,
  RotateCcw,
  Share2,
  Loader2,
  Search,
  Volume2,
  CircleAlert,
  Pause,
} from "lucide-react";
import { LoadingDots } from "@/components/ui/Loader";
import { Message } from "@/types/Message";
import { TextShimmer } from "../../../components/motion-primitives/text-shimmer";

interface AssistantMessageProps {
  message: Message;
  isGenerating: boolean;
  hasPendingUploads?: boolean;
  isWebSearching?: boolean;
  showActions: boolean;
  isCopied: boolean;
  handleCopy: () => void;
  isRegeneratingThisMessage: boolean;
  handleRegenerate: () => void;
  disableRegenerate: boolean;
  speechLoading: boolean;
  isPlaying: boolean;
  isOtherPlaying: boolean;
  speechHandlePlay: () => void;
  handleShare: () => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  isGenerating,
  hasPendingUploads,
  isWebSearching,
  showActions,
  isCopied,
  handleCopy,
  isRegeneratingThisMessage,
  handleRegenerate,
  disableRegenerate,
  speechLoading,
  isPlaying,
  isOtherPlaying,
  speechHandlePlay,
  handleShare,
}) => {
  const isErrorMessage = message.error === true;

  return (
    <>
      <div className="w-10 h-10 bg-white rounded flex justify-center items-center mr-3">
        <Image
          src="/assets/logos/pawa-logo.png"
          alt="AI Avatar"
          className="w-6 h-6 object-contain"
          loading="eager"
          width={24}
          height={24}
          priority
        />
      </div>

      <div className="relative max-w-[80%] w-full">
        <div className="whitespace-pre-wrap break-words break-all text-white">
          <div className="text-[0.9rem] overflow-hidden break-words break-all">
            {isErrorMessage ? (
              <div className="flex items-center gap-3 bg-red-800/30 border border-red-500 text-red-200 rounded-lg p-4 shadow-lg">
                <CircleAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="font-medium">{message.content}</span>
              </div>
            ) : isGenerating ? (
              hasPendingUploads ? (
                <TextShimmer className="font-avenir text-md" duration={1}>
                  Processing uploaded files...
                </TextShimmer>
              ) : isWebSearching ? (
                <div className="flex items-center gap-2 font-avenir text-md">
                  <Search className="w-4 h-4" />
                  <TextShimmer className="font-avenir text-md" duration={1}>
                    Searching across the web...
                  </TextShimmer>
                </div>
              ) : (
                <Markdown content={message.content} />
              )
            ) : (
              <Markdown content={message.content} />
            )}
          </div>

          {isGenerating && (
            <div className="flex justify-center mt-2 items-center w-full">
              <LoadingDots />
            </div>
          )}
        </div>

        {!isGenerating && showActions && (
          <div className="flex -ml-3">
            <ActionButton
              icon={
                isCopied ? (
                  <Check className="w-[13px] h-[13px]" color="#FFA200" />
                ) : (
                  <Copy className="w-[13px] h-[13px]" color="#FFA200" />
                )
              }
              tooltipText={isCopied ? "Copied!" : "Copy Message"}
              onClick={handleCopy}
            />

            <ActionButton
              icon={
                isRegeneratingThisMessage ? (
                  <Loader2
                    className="w-[13px] h-[13px] animate-spin"
                    color="#FFA200"
                  />
                ) : (
                  <RotateCcw className="w-[13px] h-[13px]" color="#FFA200" />
                )
              }
              tooltipText={
                isRegeneratingThisMessage
                  ? "Regenerating..."
                  : "Regenerate Answer"
              }
              onClick={handleRegenerate}
              disabled={disableRegenerate}
            />

            <ActionButton
              icon={
                speechLoading ? (
                  <Loader2
                    className="w-[13px] h-[13px] animate-spin"
                    color="#FFA200"
                  />
                ) : isPlaying ? (
                  <Pause className="w-[13px] h-[13px]" color="#FFA200" />
                ) : (
                  <Volume2 className="w-[13px] h-[13px]" color="#FFA200" />
                )
              }
              tooltipText={
                isOtherPlaying
                  ? "Loading..."
                  : isPlaying
                  ? "Pause"
                  : isOtherPlaying
                  ? "Stop other audio first"
                  : "Listen"
              }
              onClick={speechHandlePlay}
              disabled={isOtherPlaying}
            />

            <ActionButton
              icon={<Share2 className="w-[13px] h-[13px]" color="#FFA200" />}
              tooltipText="Share Message"
              onClick={handleShare}
            />
          </div>
        )}
      </div>
    </>
  );
};
