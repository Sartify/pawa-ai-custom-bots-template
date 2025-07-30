"use client";
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { X, Loader2, Plus } from "lucide-react";
import { MAX_FILES } from "@/constants/chat";

type UploadedFile = {
  file: File;
  loading: boolean;
};

export interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLDivElement>;
  resetTrigger?: boolean;
}

export interface FileUploadHandle {
  triggerFilePicker: () => void;
}

const isImage = (file: File) => file.type.startsWith("image/");
const isPdf = (file: File) => file.type === "application/pdf";

const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(
  ({ onFilesChange, disabled = false, resetTrigger }, ref) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

    const formatFileSize = (size: number) => {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    useImperativeHandle(ref, () => ({
      triggerFilePicker,
    }));

    useEffect(() => {
      if (previewFile) {
        const url = URL.createObjectURL(previewFile);
        setPreviewUrl(url);

        return () => {
          URL.revokeObjectURL(url);
          setPreviewUrl(undefined);
        };
      } else {
        setPreviewUrl(undefined);
      }
    }, [previewFile]);

    useEffect(() => {
      setFiles([]);
    }, [resetTrigger]);

    useEffect(() => {
      if (onFilesChange) {
        onFilesChange(files.map((f) => f.file));
      }
    }, [files, onFilesChange]);

    const triggerFilePicker = () => {
      if (!disabled && files.length < MAX_FILES) {
        fileInputRef.current?.click();
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []).filter(isPdf);
      if (!selected.length) return;

      const newFiles = [...files];
      selected.forEach((file) => {
        if (newFiles.length < MAX_FILES) {
          newFiles.push({ file, loading: true });
        }
      });
      setFiles(newFiles);

      // Simulate loading state
      setTimeout(() => {
        setFiles((prev) => prev.map((f) => ({ ...f, loading: false })));
      }, 1200);

      e.target.value = "";
    };

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div className="w-full">
        {files.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap mt-2 mb-2">
            {files.map((file, index) => (
              <div
                key={index}
                onClick={() => !file.loading && setPreviewFile(file.file)}
                className="relative flex items-center bg-[#F0F7F4] rounded-md overflow-hidden border border-b rounded-full min-w-[140px] max-w-[160px]"
              >
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden">
                  {file.loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <Loader2 className="animate-spin text-gray-300 w-4 h-4" />
                    </div>
                  ) : isImage(file.file) ? (
                    <img
                      src={URL.createObjectURL(file.file)}
                      alt={file.file.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center border border-gray justify-center w-full h-full text-black text-xs">
                      {file.file.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-0 right-0 bg-[#37DD0A] hover:bg-[#FF4E4E] text-white rounded-full p-[2px] m-[2px]"
                    disabled={disabled}
                  >
                    <X size={10} />
                  </button>
                </div>

                <div className="flex flex-col justify-center px-2 py-1 text-black text-[0.7rem] truncate">
                  <p className="truncate max-w-[120px]">{file.file.name}</p>
                  <p className="text-gray-400">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
              </div>
            ))}

            {files.length < MAX_FILES && (
              <button
                type="button"
                onClick={triggerFilePicker}
                disabled={disabled}
                className="w-12 h-12 rounded-md border border-dashed border-[#37DD0A] flex items-center justify-center hover:bg-[#F0F7F4]"
              >
                <Plus className="text-[#37DD0A]" size={20} />
              </button>
            )}
          </div>
        )}

        {previewFile && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
            onClick={() => setPreviewFile(null)}
          >
            <div
              className="relative max-w-full max-h-full p-4 bg-[#2e2e2e] rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewFile(null)}
                className="absolute top-4 right-4 text-white bg-[#2e2e2e] hover:bg-[#FF4E4E] rounded-full p-2"
              >
                <X size={18} />
              </button>

              {isImage(previewFile) ? (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-[80vh] rounded-md"
                />
              ) : isPdf(previewFile) ? (
                <embed
                  src={previewUrl}
                  type="application/pdf"
                  className="w-full max-w-4xl h-[80vh] rounded-sm"
                />
              ) : (
                <div className="text-white text-center max-w-xs mx-auto">
                  <p className="mb-2 text-lg">{previewFile.name}</p>
                  <p className="text-gray-400 mb-4">
                    This file type preview is not supported try downloading{" "}
                  </p>
                  <a
                    href={previewUrl}
                    download={previewFile.name}
                    className="inline-block px-4 py-2 bg-[#D98C06] text-black rounded-md hover:bg-[#FFA200] transition"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          disabled={disabled}
        />
      </div>
    );
  }
);

FileUpload.displayName = "FileUploader";
export default FileUpload;
