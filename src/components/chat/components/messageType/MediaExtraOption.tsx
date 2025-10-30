import { AnimatePresence, motion, MotionConfig } from "motion/react";
import type { Message } from "../../../../types/message";
import { FilePreview } from "../FilePreview";
import { useState } from "react";
import FileViewer from "./FileViewer";

const FileIcon = ({
  onClick,
  keyId,
}: {
  keyId: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      key={keyId}
      layoutId={keyId}
      className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center mb-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </motion.div>
  );
};

export const MediaExtraOption = ({
  message,
  children,
}: {
  message: Message;
  children?: React.ReactNode;
}) => {
  const items: any[] = [];
  const [showPreview, setShowPreview] = useState(false);
  const [file, setIsFile] = useState<File | null>(null);
  return (
    <MotionConfig
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 800,
        damping: 60,
        mass: 1,
      }}
    >
      <AnimatePresence>
        {!showPreview && (
          <FileIcon
            keyId="button-button"
            onClick={() => setShowPreview(true)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "0%", y: "00%" }}
            exit={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            transition={{
              duration: 0.2,
            }}
            layoutId="fileIcon"
            key="fileIcon-1"
            className="flex flex-row gap-1 w-full h-full absolute p-5 bg-amber-600 rounded"
          >
            <div className="w-1/2 flex flex-wrap content-start gap-1 ">
              <motion.button
                exit={{ opacity: 0, scale: 0.2 }}
                key="closeButton"
                layoutId="button-button"
                className="z-10 px-2 py-1 top-4 right-4 absolute bg-white rounded-md font-bold text-sm cursor-pointer"
                onClick={() => setShowPreview(false)}
              >
                Close
              </motion.button>
              {message.files.map((file, index) => {
                return (
                  <motion.div
                    layoutId={`fileIcon-${index}`}
                    key={`fileIcon-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", delay: +0.1 * index }}
                  >
                    <MediaCard
                      type={file.type?.startsWith("image/") ? "image" : "pdf"}
                      title={file.name}
                      file={file}
                      onClick={() => {
                        setIsFile(file);
                      }}
                      description={"basic text"}
                    />
                  </motion.div>
                );
              })}
            </div>
            <div className="w-1/2">
              <FileViewer files={file ? [file] : []} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
const PdfIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9H9H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Main Card Component
const MediaCard = ({
  type = "image", // 'image' or 'pdf'
  title,
  description,
  size,
  date,
  file,
  onClick,
  className = "",
}: any) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        hover:shadow-lg transition-shadow duration-300
        cursor-pointer border border-gray-200
        ${className}
      `}
      onClick={onClick}
    >
      {/* Media Container */}
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center w-[130px]">
        {type === "image" ? (
          <img
            src={URL.createObjectURL(file)}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <PdfIcon className="w-10 h-10" />
            {size && <span className="text-xs text-gray-500 mt-1">{size}</span>}
          </div>
        )}

        {/* Type Badge */}
        <div
          className={`
          absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
          ${
            type === "image"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }
        `}
        >
          {type.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          {date && <span>{date}</span>}
          {type === "pdf" && size && <span>{size}</span>}
        </div>
      </div>
    </div>
  );
};
