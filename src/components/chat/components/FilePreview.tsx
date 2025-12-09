import { motion } from "motion/react";
const isImageFile = (file: File) => file.type.startsWith("image/");

export function FilePreview({
  files,
  removeOnIndex,
  showDeleteButton = true,
}: {
  files: File[];
  showDeleteButton: boolean;
  removeOnIndex?: (index: number) => void;
}) {
  return (
    <div id="filePreview" className="mt-3 flex gap-2 overflow-x-auto pt-0.5">
      {files.map((file, index) => (
        <motion.div
          key={index}
          initial={{
            animationDelay: 0.5,
            opacity: 0.9,
            scale: 0.8,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 1000, // Controls "bounciness"
            damping: 50, // Controls "slowdown"
          }}
          className="flex flex-col justify-center items-center p-2 bg-gray-50 rounded-lg shadow-xs relative w-20 h-20"
        >
          {isImageFile(file) ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
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
            </div>
          )}
          <span className="text-xs text-gray-600 truncate w-full text-center mt-1">
            {file.name}
          </span>
          {showDeleteButton && (
            <button
              onClick={() => removeOnIndex && removeOnIndex(index)}
              className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-200 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
