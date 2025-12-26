import { motion } from "motion/react";
import { useState } from "react";

const HoverFileCard = ({
  children,
  preview,
  isAnimating,
}: {
  children: React.ReactNode;
  isAnimating: boolean;
  preview: null | React.ReactNode;
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <motion.div
      onHoverStart={() => {
        if (isAnimating) {
          return;
        }
        console.log("Hover start");
        setShowPreview(true);
      }}
      onHoverEnd={() => {
        setShowPreview(false);
      }}
      className="relative"
    >
      {children}
      <motion.div
        className="absolute w-16 h-16"
        initial={{ opacity: 0, y: 10, x: -25 }}
        animate={{ opacity: showPreview ? 1 : 0 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.3 },
        }}
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "4px",
          cursor: "pointer",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        {preview}
      </motion.div>
    </motion.div>
  );
};

export default HoverFileCard;
