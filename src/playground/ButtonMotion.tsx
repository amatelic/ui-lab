import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const ButtonMotion = () => {
  const [copied, copy] = useState(false);
  const variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };
  return (
    <button
      style={{ background: "purple" }}
      className="p-1"
      aria-label="Copy code snippet"
      onClick={() => copy(!copied)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="checkmark"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            checked
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export function Rotate() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1020",
        padding: 24,
      }}
    >
      <motion.div
        style={{
          width: 240,
          height: 120,
          background: "linear-gradient(135deg, #4f46e5, #22d3ee)",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
        // continuous rotation
        animate={{ rotate: 360 }}
        transition={{
          duration: 2, // one full turn every 2 s
          // ease: "linear", // constant speed
          repeat: Infinity, // never stop
          repeatType: "loop", // smooth looping (no yoyo)
        }}
      />
    </div>
  );
}
