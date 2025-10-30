import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RightSideControl } from "./components/RightSideControl";
import { FilePreview } from "./components/FilePreview";
import { useSpeechRecognition } from "../../hooks/speechRecognition";
interface FileWithPreview extends File {
  preview?: string;
}

const ChatInput = ({
  onMessage,
}: {
  onMessage: (message: string, files: File[]) => void;
}) => {
  const [animate, setAnimate] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const messageInputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, startListening, stopListening } = useSpeechRecognition(
    (transcribed) => {
      console.log(transcribed);
      if (transcribed && messageInputRef.current) {
        messageInputRef.current.innerText = transcribed;
        setMessage(transcribed);
      }
    },
  );

  const showSendButton = !isListening && message.length > 0;

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

  const toggleRecording = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onMessage(message, files);
      setMessage("");
      setFiles([]);
      if (messageInputRef.current) {
        messageInputRef.current.innerText = "";
      }
    }
  };

  useEffect(() => {
    if (messageInputRef.current) {
      // second option is used for cases when animating the input
      if (
        !messageInputRef.current.scrollHeight ||
        !messageInputRef.current.innerText
      ) {
        messageInputRef.current.style.height = "auto";
      } else {
        messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
      }
    }
  }, [message]);

  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#ff0088",
    borderRadius: 5,
  };

  return (
    <div className="chat-container w-full max-w-2xl mx-auto  rounded-3xl shadow-sm border bg-white border-gray-200">
      <div className="flex flex-col items-center">
        <AnimatePresence>
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
            <motion.div
              initial={{
                animationDelay: 0.5,
                width: "100%",
                height: 25,
                opacity: 0.9,
              }}
              animate={{
                height: files.length > 0 ? 70 : 0,
                opacity: 1,
              }}
              exit={{
                width: "100%",
                height: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 100, // Controls "bounciness"
                damping: 10, // Controls "slowdown"
              }}
            >
              {files.length > 0 && (
                <FilePreview
                  showDeleteButton={true}
                  files={files}
                  removeOnIndex={removeOnIndex}
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="chat-input-container w-full px-4 py-4 overflow-hidden rounded-md">
          <div className="w-full flex bg-white">
            <div
              ref={messageInputRef}
              contentEditable
              suppressContentEditableWarning
              className="message-input flex-1 px-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none max-h-[120px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none overflow-y-auto resize-none"
              data-placeholder="Ask question"
              style={{ minHeight: "46px" }}
              onInput={(e) => {
                if (e.currentTarget.textContent) {
                  setMessage(e.currentTarget.textContent);
                }
              }}
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
              isRecording={isListening}
              toggleRecording={toggleRecording}
              handleSend={handleSend}
            />
          </div>
        </div>
      </div>
      <div className="hidden !mr-2 !ml-2"></div>
    </div>
  );
};

export default ChatInput;
