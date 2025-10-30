import { GridMatrix } from "../chat/components/GridMatrix";
import { LayoutGroup, motion } from "motion/react";
import { useMousePosition } from "../../hooks/mousemove";
import { useRect } from "../../hooks/userRect";
import { useRef } from "react";

const clampToCircle = (
  pt: { x: number; y: number },
  center: { x: number; y: number },
  radius: number,
) => {
  const dx = pt.x - center.x;
  const dy = pt.y - center.y;
  const dist = Math.hypot(dx, dy);

  if (dist <= radius)
    return {
      x: 0.1 * radius,
      y: 0.1 * radius,
    };
  const nx = dx / dist;
  const ny = dy / dist;
  return {
    x: nx * radius,
    y: ny * radius,
  };
};

const HiddenIcon = ({
  size = 24,
  color = "black",
  gridPosition = {
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    adjustedX: 0,
    adjustedY: 0,
  },
  gridRect = { x: 0, y: 0, height: 0, width: 0 },
  ...props
}) => {
  const x = gridPosition.x - gridRect.x;
  const y = gridPosition.adjustedY - 0;

  return (
    <motion.div
      initial={{
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { delay: 0.25, type: "spring" },
      }}
      style={{
        background: "hsl(210, 3%, 13%)",
      }}
      className="pointer-none shadow-xs w-64 h-64  rounded-[128px] flex justify-center items-center"
    >
      <motion.div
        initial={{
          scale: 0.2,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { delay: 0.5, type: "spring" },
        }}
        className="w-48 h-48  rounded-[128px] flex justify-center items-center"
        style={{
          background: "hsl(0, 0%, 84%)",
          boxShadow:
            "-1px 0px 15px 10px rgba(0, 0, 0, 0.2), -1px 0px 2px 1px rgba(0, 0, 0, 0.5)",
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          width="160"
          height="160"
          role="img"
          aria-label="Simple eye icon"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              delay: 1,
              type: "spring",
              damping: 10,
              stiffness: 50,
            },
          }}
        >
          <path
            d="M10 60 Q60 10 110 60 Q60 110 10 60 Z"
            fill="none"
            stroke="#202122"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          <motion.circle
            cx="60"
            cy="60"
            r="20"
            fill="#202122"
            animate={clampToCircle(
              {
                x: x,
                y: y,
              },
              { x: gridRect.width / 2, y: gridRect.height / 2 },
              6,
            )}
          />

          <motion.circle
            cx="60"
            cy="60"
            r="5"
            fill="#ffffff"
            animate={clampToCircle(
              {
                x: x,
                y: y,
              },
              { x: gridRect.width / 2, y: gridRect.height / 2 },
              10,
            )}
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export const GridMatrixPresentation = () => {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const gridPosition = useMousePosition(gridContainerRef.current);
  const gridRect = useRect(gridContainerRef);

  return (
    <motion.div ref={gridContainerRef} className="relative w-128 h-128">
      <LayoutGroup>
        <motion.div
          className="secret-container"
          style={{
            position: "absolute",
          }}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { delay: 0.1, type: "spring" },
          }}
        >
          <GridMatrix />
          <motion.div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <HiddenIcon
              size={48}
              color="black"
              gridPosition={gridPosition}
              gridRect={gridRect as any}
            />
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
};
