import { motion, AnimatePresence, secondsToMilliseconds } from "motion/react";
import { filter } from "motion/react-client";
import { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import MotionCard from "./MotionCard";
import { TimerClock } from "./TimerClock";

interface MotionClockProps {
  size?: number;
  duration?: number;
  delay?: number;
  color?: string;
  tickColor?: string;
}

interface TickEvents {
  title: string;
  description: string;
}
interface Tick {
  angle: number;
  x: number;
  y: number;
  index: number;
  events: TickEvents[];
}

const generateTicks = (size: number): Tick[] => {
  const ticks: Tick[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30 - 90) * Math.PI) / 180; // 30° per tick (12 ticks = 360°)
    const x = Math.cos(angle) * (size / 2);
    const y = Math.sin(angle) * (size / 2);

    ticks.push({
      angle: i * 30,
      x,
      y,
      index: i,
      events:
        Math.random() > 0.5
          ? [
              { title: "Event 1", description: "Description 1" },
              { title: "Event 2", description: "Description 2" },
            ]
          : [],
    });
  }
  return ticks;
};

const ticker = generateTicks(200);

export const MotionClock = ({
  size = 200,
  duration = 0.3,
  delay = 0,
  color = "text-gray-800",
  tickColor = "bg-gray-300",
}: MotionClockProps) => {
  const ref = useRef(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration, delay, type: "spring" },
    },
  };

  const tickVariants = {
    initial: (tick: Tick) => {
      return {
        transform: `rotate(${tick.angle}deg) translateX(${tick.x}px) translateY(${tick.y}px)  rotate(${tick.angle}deg) scale(0.1)`,
      };
    },
    animate: (tick: Tick) => {
      return {
        transform: `translateX(${tick.x}px) translateY(${tick.y}px) rotate(${tick.angle}deg) scale(0.9)`,
        transition: { delay: 0.05 * tick.index, type: "spring" },
      };
    },
    hover: (tick: Tick) => {
      return {
        transform: `translateX(${tick.x}px) translateY(${tick.y}px) rotate(${tick.angle}deg) scale(1.1)`,
      };
    },
    exit: (tick: Tick) => {
      return {
        scale: 0,
        opacity: 0,
        filter: "blur(2px)",
      };
    },
  };

  const RenderTicks = ({
    ticker,
    activeIndex,
    setActiveIndex,
  }: {
    ticker: Tick[];
    activeIndex: number | null;
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    return (
      <div className="w-full h-full flex justify-center items-center absolute">
        {ticker.map((tick, index) => (
          <>
            <motion.div
              key={index}
              custom={tick}
              layoutId={`ticket-${index}`}
              style={{
                transformOrigin: "center",
              }}
              className={`p-4 absolute  origin-center`}
              variants={tickVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                onClick={() => {
                  if (index == activeIndex) {
                    setActiveIndex(null);
                  } else {
                    setActiveIndex(index);
                  }
                  setActiveIndex(index);
                }}
                animate={{
                  backgroundColor:
                    activeIndex === index
                      ? "oklch(83.7% 0.128 66.29"
                      : tick.events.length === 0
                        ? "oklch(87.2% 0.01 258.338)"
                        : "oklch(27.2% 0.01 258.338)",
                }}
                className={`cursor-pointer w-1.5 h-6 bg-gray-200  shadow`}
              />
            </motion.div>
            <MotionCard
              events={tick.events}
              index={index}
              activeIndex={activeIndex}
            />
          </>
        ))}
      </div>
    );
  };

  const handleClickOutside = () => {
    // Your custom logic here
    console.log("clicked outside");
    setActiveIndex(null);
  };

  useOnClickOutside(ref as any, handleClickOutside);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        ref={ref}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Clock Face */}
        <div
          className="absolute rounded-full border-2 border-gray-200 shadow flex"
          style={{ width: size, height: size }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <TimerClock />
          </div>
          <RenderTicks
            ticker={ticker}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </motion.div>
    </div>
  );
};
