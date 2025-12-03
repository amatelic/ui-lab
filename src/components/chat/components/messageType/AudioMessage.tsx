import React, { useRef, useEffect, useState } from "react";
import { useWithSound } from "../../../../hooks/useSound";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { set } from "astro/zod";

type Props = { audioSrc: string };

export default function AudioVisualizer({ audioSrc }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { canvasRef, playing, stop, toggle } = useWithSound(audioSrc);

  const close = () => {
    if (playing) {
      toggle();
    }
    stop();
    setIsOpen(false);
  };

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}>
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {!isOpen && (
            <motion.button
              initial={{
                scale: 0.5,
                filter: "blur(4px)",
              }}
              animate={{
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                scale: 0.5,
                filter: "blur(4px)",
              }}
              key="playButton-welcome"
              layoutId="playButton"
              className="px-4 py-2 w-auto h-auto z-index-1  bg-gray-500 rounded !text-white"
              onClick={() => setIsOpen(true)}
            >
              Start playing
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {!isOpen && (
            <motion.div
              exit={{
                scale: 0.5,
                filter: "blur(12px)",
              }}
              key="audioContainer-welcome"
              layoutId="audioContainer"
              className="h-1 w-1 absolute top-0 left-0 pointer-none:"
            ></motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              initial={{
                scale: 0.7,
                filter: "blur(12px)",
              }}
              animate={{
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                scale: 0.5,
                filter: "blur(12px)",
              }}
              layout
              key="audioContainer-container"
              layoutId="audioContainer"
              className="rounded-2xl p-2 shadow relative overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                style={{ background: "#000" }}
                className="rounded-xl"
              />
              <br />
              <div className="flex justify-center w-full pb-2">
                {isOpen && (
                  <motion.button
                    key={playing ? "Pause" : "Play"}
                    layoutId="playButton"
                    className="px-4 py-2 w-auto h-auto z-index-1  bg-gray-500 rounded !text-white cursor-pointer"
                    onClick={toggle}
                  >
                    {playing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </motion.button>
                )}
              </div>
              <button
                className="px-2 py-1 top-4 right-4 absolute bg-white rounded-md font-bold text-sm cursor-pointer"
                onClick={() => close()}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
