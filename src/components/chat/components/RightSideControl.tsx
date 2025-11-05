import { div } from "motion/react-client";
import { motion } from "motion/react";

export function RightSideControl({
  isRecording,
  toggleRecording,
  handleSend,
  showButton,
}: any) {
  let animate = {};
  let initial = {
    transform: "translateX(48px)",
  };

  if (showButton) {
    animate = {
      visibility: "show",
      transform: "translateX(6px)",
    };
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ type: "spring" }}
      className="flex"
    >
      {isRecording}
      <button
        className={`p-2 rounded-full hover:bg-gray-100 ${isRecording ? " text-red-500" : "text-gray-500"}`}
        onClick={toggleRecording}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isRecording ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      </button>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ type: "spring", visualDuration: 0.5, bounce: 0.25 }}
      >
        <button
          className="p-2 text-white focus:outline-none"
          onClick={handleSend}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
