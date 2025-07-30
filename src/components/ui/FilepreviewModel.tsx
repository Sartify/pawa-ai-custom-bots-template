"use client";
import React from "react";

interface PreviewFile {
  url: string;
  name: string;
  isImage: boolean;
}

interface FilePreviewModalProps {
  previewFile: PreviewFile | null;
  onClose: () => void;
}

export const FilePreviewModel: React.FC<FilePreviewModalProps> = ({
  previewFile,
  onClose,
}) => {
  if (!previewFile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-lg font-medium truncate max-w-md">
              {previewFile.name}
            </h2>
            <span className="text-gray-400 text-sm">
              {previewFile.isImage
                ? "Image"
                : previewFile.url.toLowerCase().endsWith(".pdf")
                ? "PDF Document"
                : "File"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center relative">
          {previewFile.isImage ? (
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{
                  maxHeight: "calc(95vh - 100px)",
                  maxWidth: "100%",
                }}
              />
            </div>
          ) : previewFile.url.toLowerCase().endsWith(".pdf") ? (
            <div className="w-full h-full bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center">
              <embed
                src={previewFile.url}
                type="application/pdf"
                className="w-full h-full rounded"
                style={{ minHeight: "70vh" }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">
              <div className="text-center text-white">
                <p className="text-lg font-medium">{previewFile.name}</p>
                <p className="text-gray-400 mt-1">
                  Preview not available for this file type.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = previewFile.url;
                    link.download = previewFile.name;
                    link.click();
                  }}
                  className="px-4 py-2 bg-[#D98C06] hover:bg-[#D98C06]/80 rounded text-white transition"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="text-center mt-4">
          <span className="text-gray-400 text-sm">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>{" "}
            to close
          </span>
        </div>
      </div>
    </div>
  );
};
