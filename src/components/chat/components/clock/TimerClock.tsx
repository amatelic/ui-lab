import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const numberVariants = {
  enter: (direction: number) => ({
    y: -20,
    opacity: 0,
    filter: "blur(2px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: 20,
    opacity: 0,
    filter: "blur(2px)",
  }),
};

export const TimerClock = ({ color = "text-gray-800", duration = 0.3 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="absolute flex items-center">
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout" custom={1}>
          <motion.div
            key={hours}
            custom={1}
            variants={numberVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration, type: "spring" }}
            className={`text-2xl font-bold ${color}`}
          >
            {hours}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mx-1">
        <AnimatePresence mode="popLayout" custom={1}>
          <motion.span
            key="colon"
            variants={numberVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-2xl font-bold"
          >
            :
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout" custom={1}>
          <motion.div
            key={minutes}
            custom={1}
            variants={numberVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration, type: "spring" }}
            className={`text-2xl font-bold ${color}`}
          >
            {minutes}
          </motion.div>
        </AnimatePresence>
        {/*<AnimatePresence mode="popLayout" custom={1}>
              <motion.div
                key={seconds}
                custom={1}
                variants={numberVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration, type: "spring" }}
                className={`text-2xl font-bold ${color}`}
              >
                {seconds}
              </motion.div>
            </AnimatePresence>*/}
      </div>
    </div>
  );
};
