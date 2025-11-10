import { AnimatePresence } from "motion/react";
import { useState } from "react";
import * as motion from "motion/react-client";

export const OptionSection = ({
  children,
  options,
  onChange,
}: {
  children: React.ReactNode;
  options: any[];
  onChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      <motion.div className="flex flex-row gap-1 w-full absolute">
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={false}
            layoutId={option.layoutId}
            onClick={() => onChange(option.layoutId)}
            className="bg-gray-100 rounded-md p-1.5 cursor-pointer"
          >
            {option.icon}
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </div>
  );
};
