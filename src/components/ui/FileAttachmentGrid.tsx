"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";

interface FileAttachmentGridProps {
  files: any[];
  fileLoadingStates: Record<string, boolean>;
  imageLoadStates: Record<string, boolean>;
  objectUrls: Record<string, string>;
  onPreview: (preview: { url: string; name: string; isImage: boolean }) => void;
}

export const FileAttachmentGrid: React.FC<FileAttachmentGridProps> = ({
  files,
  fileLoadingStates,
  // imageLoadStates,
  objectUrls,
  onPreview,
}) => {
  // Local state to track failed image loads
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const getGridLayout = (count: number) => {
    if (count === 1) return "grid-cols-1";
    return "grid-cols-2";
  };

  const getGridRows = (count: number) => {
    if (count <= 2) return "grid-rows-1";
    return "grid-rows-2";
  };

  const getItemSpan = (index: number, total: number) => {
    if (total === 3 && index === 2) return "col-span-2";
    return "";
  };

  const getFileKey = (file: any, idx: number) =>
    file.id || file.fileName || file.name || `file-${idx}`;

  const getFileName = (file: any, idx: number) => {
    if (file instanceof File) return file.name;
    if (file.file instanceof File) return file.file.name;
    return file.fileName || file.name || `File-${idx + 1}`;
  };

  const getFileSize = (file: any) => {
    if (file instanceof File) return file.size;
    if (file.file instanceof File) return file.file.size;
    return file.size || null;
  };

  const isImageFile = (file: any) => {
    if (file instanceof File) return file.type.startsWith("image/");
    if (file.file instanceof File) return file.file.type.startsWith("image/");
    const name = file.fileName || file.name || "";
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
  };

  const getDisplayUrl = (file: any, key: string) => {
    if (objectUrls[key]) {
      return objectUrls[key];
    }

    if (file instanceof File || file.file instanceof File) {
      const actualFile = file instanceof File ? file : file.file;
      return URL.createObjectURL(actualFile);
    }

    return file.fileUrl || "";
  };

  const handleImageError = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  const renderImagePlaceholder = (key: string, isActuallyLoading = false) => (
    <div className="relative w-full h-full bg-gray-700 rounded-md flex flex-col items-center justify-center p-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="text-xs text-gray-400 text-center">
        <div className="bg-gray-600 h-3 w-20 rounded mb-1"></div>
        <div className="text-gray-500">
          {isActuallyLoading ? "Processing..." : "Loading..."}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`grid gap-2 w-full max-w-[400px] ${getGridLayout(
        files.length
      )} ${getGridRows(files.length)}`}
      style={{
        gridTemplateRows:
          files.length === 1
            ? "250px"
            : files.length <= 2
            ? "200px"
            : "150px 150px",
      }}
    >
      {files.slice(0, 4).map((file, idx) => {
        const key = getFileKey(file, idx);
        const name = getFileName(file, idx);
        const size = getFileSize(file);
        const url = getDisplayUrl(file, key);
        const isImage = isImageFile(file);
        const loading = fileLoadingStates[key];
        const span = getItemSpan(idx, files.length);
        const hasFailedToLoad = failedImages[key];

        // Check if this is a fresh File object (just submitted)
        const isFreshFile = file instanceof File || file.file instanceof File;

        // Only show loading for server files that are actually loading
        // Never show loading for fresh File objects since we can display them immediately
        const shouldShowLoading = !isFreshFile && loading;

        if (isImage) {
          return (
            <div
              key={key}
              className={`relative w-full h-full overflow-hidden rounded-md bg-gray-700 ${span}`}
              style={{ minHeight: "150px" }}
            >
              {!url || shouldShowLoading || hasFailedToLoad ? (
                renderImagePlaceholder(key, shouldShowLoading)
              ) : (
                <div
                  onClick={() => onPreview({ url, name, isImage: true })}
                  className="block w-full h-full cursor-pointer relative"
                >
                  <img
                    src={url}
                    alt={name}
                    className="object-cover w-full h-full opacity-100"
                    onError={() => handleImageError(key)}
                  />
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={key}
            className={`relative w-full h-full overflow-hidden rounded-md bg-gray-700 flex items-center justify-center p-4 ${span}`}
          >
            {!url || shouldShowLoading ? (
              <div className="flex flex-col items-center justify-center space-y-2 animate-pulse">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faPaperclip}
                    className="text-gray-400 w-5 h-5"
                  />
                </div>
                <div className="text-center">
                  <div className="bg-gray-600 h-3 w-24 rounded mb-1"></div>
                  <div className="text-xs text-gray-500">
                    {shouldShowLoading ? "Processing..." : "Loading..."}
                  </div>
                </div>
                {shouldShowLoading && (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                )}
              </div>
            ) : (
              <div
                onClick={() => onPreview({ url, name, isImage: false })}
                className="flex items-center gap-3 border border-gray-500 rounded-lg px-4 py-3 bg-gray-600 hover:bg-gray-500 transition-colors text-sm text-white w-full max-w-full cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="text-white w-4 h-4 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{name}</div>
                  {size && (
                    <div className="text-xs text-gray-300">
                      {(size / 1024).toFixed(1)} KB
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
