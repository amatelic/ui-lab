import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { clsx } from "clsx";

const MotionCard = ({ events, index, activeIndex }: any) => {
  console.log(events);
  return (
    <AnimatePresence mode="popLayout" custom={1}>
      {activeIndex === index && (
        <motion.div
          key={index}
          layoutId={`ticket-${index}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="relative w-32 rounded-2xl  top-0 -right-32 max-w-md  overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          {events.map((event: any, i: number) => (
            <div
              key={i}
              className={clsx(
                "absolute px-2 py-4 bg-amber-50 w-full",
                `translate-y-${i + 1}`,
              )}
            >
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                {event.description}
              </p>
            </div>
          ))}
          <div className="relative mt-4 w-full h-16 bg-amber-950 rounded-2xl max-w-md  overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotionCard;
