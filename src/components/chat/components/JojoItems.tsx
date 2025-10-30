import { motion, stagger } from "motion/react";
import JojoWord from "../../../assets/jojo/world.png";
// import JojoKingCrimson from "../../../assets/jojo/king-crimson.png";
import JojoSnake from "../../../assets/jojo/snake.png";
import Jojod4c from "../../../assets/jojo/d4c.png";
import JojoKillerQueen from "../../../assets/jojo/killer-queen.png";
import JojoMadeInHeaven from "../../../assets/jojo/made-in-heaven.png";

const variants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    // rotate: 360,
    // scale: 1.2,
    transition: {
      duration: 2,
      // ease: "easeInOut",
      repeat: Infinity,
      // repeatType: "loop",
    },
  },
};

export function JojoItems() {
  return (
    <>
      <motion.div
        variants={variants}
        initial={"inititial"}
        animate={"animate"}
        className="to-left flex-1 bg-amber-300 border border-black border-l-2 border-t-2"
      >
        <img
          className="w-[256px] h-[256px] bg-cover mix-cover "
          src={Jojod4c.src}
          alt="jojo"
        />
      </motion.div>
      <motion.div
        variants={variants}
        initial={"inititial"}
        animate={"animate"}
        className="top-right flex-1 bg-blue-300 border border-black border-r-2 border-t-2"
      >
        <img
          className="w-[256px] h-[256px] bg-cover mix-cover scale-[0.8]"
          src={JojoSnake.src}
          alt="jojo"
        />
      </motion.div>
      <motion.div
        variants={variants}
        initial={"inititial"}
        animate={"animate"}
        className="bottom-left flex-1 bg-green-300 border border-black border-l-2 border-b-2"
      >
        <img
          className="w-[256px] h-[256px] bg-cover mix-cover scale-[0.8]"
          src={JojoMadeInHeaven.src}
          alt="jojo"
        />
      </motion.div>
      <motion.div
        variants={variants}
        initial={"inititial"}
        animate={"animate"}
        className="bottom-right flex-1 bg-red-300 border border-black border-r-2 border-b-2"
      >
        <img
          className="w-[256px] h-[256px] bg-cover mix-cover scale-[0.9]"
          src={JojoWord.src}
          alt="jojo"
        />
      </motion.div>
    </>
  );
}
