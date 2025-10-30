import React from "react";
import { motion } from "motion/react";

const LoadingDots = () => {
  const dotVariants = {
    bounce: {
      y: [-5, 5, -5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const size = "6px";
  const transition = {
    repeat: Infinity,
    x: -5,
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        height: "15px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: "gray",
            borderRadius: "50%",
          }}
          animate={{
            y: [0, 2.5, 0],
          }}
          transition={{
            delay: i * 0.05,
            duration: 0.5, // one full turn every 2 s
            repeat: Infinity, // never stop
            repeatType: "loop", // smooth looping (no yoyo)
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
