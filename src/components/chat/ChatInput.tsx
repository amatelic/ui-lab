import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  AudioRecordingService,
  recordingRef,
} from "../../services/AudioService";
interface FileWithPreview extends File {
  preview?: string;
}

const ChatInput = ({ onMessage }: { onMessage: (message: string) => void }) => {
  const audioRecording = useRef<AudioRecordingService>(null);
  const [animate, setAnimate] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const messageInputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRecording = audioRecording.current?.isRecording || false;
  const showSendButton = message.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  const removeOnIndex = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFilePreview = () => {
    // Preview is handled in the render below
  };

  const toggleRecording = async () => {
    try {
      if (!audioRecording.current) {
        audioRecording.current = await recordingRef();
      }

      const au = audioRecording.current;

      if (au.isRecording) {
        const audioText = await au.stop();
        setMessage(audioText);
        if (messageInputRef.current) {
          messageInputRef.current.innerText = audioText;
        }
      } else {
        await au.startRecording();
      }
    } catch (err) {
      console.error("Error toggling recording:", error.message);
    }
  };

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onMessage(message);
      setMessage("");
      setFiles([]);
      if (messageInputRef.current) {
        messageInputRef.current.innerText = "";
      }
    }
  };

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "auto";
      messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#ff0088",
    borderRadius: 5,
  };

  return (
    <div className="chat-container w-full max-w-2xl mx-auto  rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col items-center">
        <motion.div
          layout
          className="h-auto w-full"
          style={{
            padding: animate || files.length ? "16px 16px 16px 16px" : "0px",
          }}
        >
          <motion.div
            initial={{ width: "100%", height: 0 }}
            animate={{
              height: animate ? 200 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100, // Controls "bounciness"
              damping: 10, // Controls "slowdown"
            }}
            style={{ background: "blue" }}
          />
          {files.length > 0 && (
            <FilePreview files={files} removeOnIndex={removeOnIndex} />
          )}
        </motion.div>
        <div className="chat-input-container w-full px-4 py-4 overflow-hidden rounded-md">
          <div className="w-full flex bg-white">
            <div
              ref={messageInputRef}
              contentEditable
              suppressContentEditableWarning
              className="message-input flex-1 px-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none max-h-[120px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none overflow-y-auto resize-none"
              data-placeholder="Ask question"
              style={{ minHeight: "46px" }}
              onInput={(e) => setMessage(e.currentTarget.textContent || "")}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex items-center justify-between w-full pt-2">
            <label className="p-3 text-gray-500 rounded-full cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </label>
            <RightSideControl
              showButton={showSendButton}
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              handleSend={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function FilePreview({
  files,
  removeOnIndex,
}: {
  files: File[];
  removeOnIndex: (index: number) => void;
}) {
  return (
    <div id="filePreview" className="mt-3 flex gap-2 overflow-x-auto">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex flex-col justify-center items-center p-2 bg-gray-50 rounded-lg shadow-xs relative h-20"
        >
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-12 w-12 object-cover rounded-md mb-1"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center mb-1">
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
            </div>
          )}
          <span className="text-xs text-gray-600 truncate w-20 text-center">
            {file.name}
          </span>
          <button
            onClick={() => removeOnIndex(index)}
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
        </div>
      ))}
    </div>
  );
}

function RightSideControl({
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
      <button
        className={`p-2 rounded-full hover:bg-gray-100 ${isRecording ? "text-red-500" : "text-gray-500"}`}
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

export default ChatInput;
