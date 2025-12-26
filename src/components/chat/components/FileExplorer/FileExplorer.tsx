import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
} from "motion/react";
import { useEffect, useState } from "react";
import HoverFileCard from "./PreviewCard";
import { getFileType, getFileTypeFromUrl } from "../../../../utils/web";
import Image from "astro/components/Image.astro";

const buttonVariants = {
  initial: ({ width }: { position: number; width: number }) => ({
    x: 0,
    maxWidth: width,
    filter: "blur(10px)",
    rotate: -180,
  }),
  animate: ({ position, width }: { position: number; width: number }) => ({
    x: position,
    maxWidth: width,
    filter: "blur(0px)",
    rotate: 0,
  }),
  exit: {
    x: 0,
    filter: "blur(2px)",
    rotate: -180,
    opacity: 0,
  },
};

// @TODO How do i disable the hover until the animation is completed
const FileIcon = () => {
  return (
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
  );
};

export const FileExplorer = ({ files }: { files: ImageMetadata[] }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMore, setShowMore] = useState(false);
  let size = 40 * files.length;
  const padding = 10;
  let duration = files.length * 0.1;

  const style =
    "absolute h-10 w-full bg-gray-200 rounded-3xl flex items-center justify-center top-0 left-0";
  const icon = 40;

  return (
    <MotionConfig transition={{ duration: duration }}>
      <motion.div
        animate={{ height: 40, width: showMore ? size + padding + icon : icon }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        className="relative"
        initial={false}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!showMore ? (
            <motion.div
              key="open"
              layout
              initial={{ x: size, opacity: 0, maxWidth: icon, rotate: 180 }}
              animate={{ x: 0, opacity: 1, maxWidth: icon, rotate: 0 }}
              exit={{ x: size, opacity: 0, maxWidth: icon }}
              className={`${style} shadow-sm cursor-pointer`}
              onClick={() => setShowMore(true)}
            >
              <FileIcon />
            </motion.div>
          ) : (
            <motion.div
              layout
              key="slider"
              initial={{ maxWidth: icon }}
              animate={{ maxWidth: size }}
              exit={{ maxWidth: icon }}
              className={`${style}`}
              onClick={() => setShowMore(false)}
              transition={{
                type: "spring",
                bounce: 0.3,
              }}
            >
              <motion.div
                key="file-explorer-content"
                layoutId="file-explorer-content"
                className="flex bg-gray-200 rounded-4xl w-full px-2"
                exit={{ opacity: 0, scale: 0.5, maxWidth: 0 }}
              >
                {files.map((item, index) => {
                  let type = getFileTypeFromUrl(item.src);

                  console.log("TEST", type, item);

                  let component = <h5>Is not supported</h5>;

                  if (type === "image") {
                    component = (
                      <div>
                        <img
                          className="w-full h-full bg-cover bg-cover"
                          src={item.src}
                          alt="jojo"
                        />
                      </div>
                    );
                  }
                  return (
                    <motion.div
                      layout
                      key={`file-icon-${index}`}
                      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        damping: 50,
                        stiffness: 750,
                        bounce: 0.5,
                        delay: 0.1 + 0.1 * index,
                      }}
                      className="px-2 cursor-pointer"
                    >
                      <HoverFileCard
                        preview={component}
                        isAnimating={isAnimating}
                      >
                        <FileIcon
                          key={`file-icon-${index}`}
                          onClick={() => {
                            setShowMore(false);
                          }}
                        />
                      </HoverFileCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout" initial={false}>
          {showMore ? (
            <motion.button
              key="close"
              layout
              custom={{ position: size + padding, width: icon }}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: "spring",
                // damping: 50,
                // stiffness: 750,
                bounce: 0.3,
              }}
              style={{
                color: "#6a7282",
                fontWeight: "500",
              }}
              className={`${style} cursor-pointer shadow-sm`}
              onClick={() => setShowMore(false)}
            >
              X
            </motion.button>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
};
