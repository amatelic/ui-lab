import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react"; // Correct import path

export const Test = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MotionConfig transition={{ type: "spring", duration: 1, bounce: 0.1 }}>
      <div className="relative w-full h-full">
        <AnimatePresence mode="popLayout">
          {!isOpen ? (
            <motion.button
              key="open-button"
              layoutId="test1"
              className="absolute"
              onClick={() => setIsOpen(true)}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.circle cx="50" cy="50" r="40" fill="#0070f3" />
              </svg>
              <motion.div
                exit={{ opacity: 0, scale: 0.5 }}
                layoutId="close-button1"
                className="bg-blue-500 w-18 h-18 rounded-2xl"
              >
                b
              </motion.div>
            </motion.button>
          ) : (
            <motion.div
              key="modal"
              layoutId="test1"
              transition={{ type: "spring", duration: 5, bounce: 0.1 }}
              className="w-full h-full bg-red-300 p-4 fixed top-0 left-0"
              onClick={() => setIsOpen(false)}
            >
              this is a test
              <motion.button
                initial={{
                  filter: "blur(15px)",
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  filter: "blur(0px)",
                  opacity: 1,
                  scale: 1,
                }}
                layoutId="close-button1"
                className="absolute top-4 right-4 p-2 bg-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents closing the modal when clicking the button
                  setIsOpen(false);
                }}
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
