import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
export interface FileViewerProps {
  files: File[];
  initialIndex?: number;
  onClose?: () => void;
  showControls?: boolean;
  className?: string;
  zoomStep?: number;
  maxZoom?: number;
  minZoom?: number;
  onFileChange?: (file: File, index: number) => void;
}

export type SupportedFileType = "image" | "pdf" | "text" | "unsupported";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileViewer: React.FC<FileViewerProps> = ({
  files = [],
  initialIndex = 0,
  onClose,
  showControls = true,
  className = "",
  zoomStep = 0.1,
  maxZoom = 3,
  minZoom = 0.5,
  onFileChange,
}) => {
  const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);
  const [pdfPageNumber, setPdfPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentFile: File | undefined = files[0];

  const getFileType = (file: File): SupportedFileType => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".xml") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".html") ||
      file.name.endsWith(".css")
    )
      return "text";
    return "unsupported";
  };

  const fileType: SupportedFileType = currentFile
    ? getFileType(currentFile)
    : "unsupported";

  useEffect(() => {
    loadFileContent();
  }, [currentFile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onClose) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [files.length]);

  const loadFileContent = async (): Promise<void> => {
    if (!currentFile) return;

    try {
      setLoading(true);

      if (fileType === "text") {
        const content = await currentFile.text();
        setTextContent(content);
      }

      // For images and PDFs, we use object URLs which are handled separately
      setLoading(false);
    } catch (err) {
      console.error("Error loading file:", err);
      setError(
        `Failed to load file: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setLoading(false);
    }
  };

  const zoomIn = (): void => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const zoomOut = (): void => {
    setZoom((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const resetZoom = (): void => {
    setZoom(1);
  };

  const onPDFLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPdfNumPages(numPages);
    setLoading(false);
  };

  const onPDFLoadError = (error: Error): void => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF");
    setLoading(false);
  };

  const nextPDFPage = (): void => {
    if (pdfNumPages && pdfPageNumber < pdfNumPages) {
      setPdfPageNumber(pdfPageNumber + 1);
    }
  };

  const previousPDFPage = (): void => {
    if (pdfPageNumber > 1) {
      setPdfPageNumber(pdfPageNumber - 1);
    }
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!files.length) {
    return (
      <div
        className={`relative w-full h-full  rounded-lg overflow-hidden flex flex-col ${className}`}
      >
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">No files to display</p>
        </div>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div
        className={`relative w-full h-full  rounded-lg overflow-hidden flex flex-col ${className}`}
      >
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">File not found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full  rounded-lg overflow-hidden flex flex-col ${className}`}
      ref={containerRef}
    >
      {showControls && onClose && (
        <div className="flex justify-between items-center p-4">
          <button
            className="w-8 h-8 bg-red-500 border-none text-white rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={onClose}
            aria-label="Close viewer"
          >
            ×
          </button>
          <div className="text-white font-medium flex items-center gap-3">
            <span className="bg-blue-500 px-2 py-1 rounded text-xs">
              {getFileExtension(currentFile.name)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold">{currentFile.name}</span>
              <span className="text-xs text-gray-300">
                {formatFileSize(currentFile.size)} • {currentFile.type}
              </span>
            </div>
            {fileType === "pdf" && pdfNumPages && (
              <span className="text-sm text-gray-300">
                Page {pdfPageNumber} of {pdfNumPages}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center relative overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 z-10">
            <div className="text-white flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 z-10">
            <div className="text-white text-center">
              <p className="text-lg font-bold mb-2">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!currentFile && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 z-10">
            <div className="text-white">Preparing file...</div>
          </div>
        )}

        {fileType === "image" && (
          <div
            className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={URL.createObjectURL(currentFile)}
              alt={currentFile.name}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setLoading(false)}
              onError={() => {
                setError("Failed to load image");
                setLoading(false);
              }}
            />
          </div>
        )}

        {fileType === "pdf" && currentFile && (
          <div className="max-w-full max-h-full overflow-auto">
            <Document
              file={currentFile}
              onLoadSuccess={onPDFLoadSuccess}
              onLoadError={onPDFLoadError}
              loading={<div className="text-white p-8">Loading PDF...</div>}
            >
              <Page
                pageNumber={pdfPageNumber}
                scale={zoom}
                loading={<div className="text-white p-8">Loading page...</div>}
              />
            </Document>
          </div>
        )}

        {fileType === "text" && (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-white text-sm font-mono whitespace-pre-wrap break-words p-4 rounded-lg max-w-full overflow-auto">
                {textContent ||
                  (loading
                    ? "Loading text content..."
                    : "No content available")}
              </pre>
            </div>
          </div>
        )}

        {fileType === "unsupported" && (
          <div className="text-white text-center p-4">
            <div className="bg-red-500 p-4 rounded-lg mb-4">
              <p className="text-lg font-bold">Unsupported File Format</p>
            </div>
            <p>This file type cannot be previewed.</p>
            <p className="text-sm text-gray-300 mt-2">
              File: {currentFile.name} ({currentFile.type})
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Supported formats: Images, PDFs, Text files
            </p>
          </div>
        )}
      </div>

      {showControls && (
        <div className="flex justify-between items-center p-4 flex-wrap gap-4">
          {fileType === "pdf" && pdfNumPages && pdfNumPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={previousPDFPage}
                disabled={pdfPageNumber === 1}
                className="px-3 py-2 border-none text-white rounded cursor-pointer transition-colors hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                ‹ Page
              </button>
              <input
                type="number"
                min="1"
                max={pdfNumPages}
                value={pdfPageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= pdfNumPages) {
                    setPdfPageNumber(page);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-600 rounded bg-gray-900 text-white text-center"
              />
              <button
                onClick={nextPDFPage}
                disabled={pdfPageNumber === pdfNumPages}
                className="px-3 py-2 bg-gray-600 border-none text-white rounded cursor-pointer transition-colors hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Page ›
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileViewer;
