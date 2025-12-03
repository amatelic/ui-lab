// https://css-pattern.com/
import { motion, stagger } from "motion/react";
import JojoKillerQueen from "../../../assets/jojo/killer-queen.png";

export const JoJoLand = ({ image, children }) => {
  return (
    <div
      style={
        {
          // filter: "drop-shadow(0 0 0.75rem crimson)",
        }
      }
      className="jojolands w-[520px] h-[520px] grid grid-cols-2 relative overflow-hidden"
    >
      {children}
      <div
        style={{
          filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))",
        }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <motion.div
          initial="rest"
          whileHover="hover"
          className="w-full h-full pointer-none"
        >
          <motion.div
            // initial={{
            //   scale: 0.5,
            // }}
            variants={{
              rest: { scale: 0.5 },
              hover: {
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 50, // Controls "bounciness"
                  damping: 10,
                  mass: 1,
                },
              },
            }}
            style={{
              aspectRatio: 1,
              transform: "scale(0.7)",
              // clipPath: "polygon(50% 0,79% 90%,2% 35%,98% 35%,21% 90%)",
            }}
            className="w-full h-full relative"
          >
            <div className="jojostar absolute bg-black scale-[1.05] w-full h-full shadow"></div>
            <div className="jojostar jojostar-container  absolute bg-[#7c5cf5] w-full h-full">
              <img
                style={{ transform: "scale(0.8) translate(-7%, -0%)" }}
                className="w-full h-inherit mix-cover"
                src={JojoKillerQueen.src}
                alt="JoJo Land Image"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
