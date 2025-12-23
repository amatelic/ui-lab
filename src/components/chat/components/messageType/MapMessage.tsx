import {
  AnimatePresence,
  motion,
  MotionConfig,
  type MotionProps,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ReactDeckRender } from "../../../ReactDeckRender";
import { set } from "astro/zod";
import { MapIcon } from "../map/MapIcon";
import { ErrorBoundary } from "../ErrorHandling";
import ChatInput from "../../ChatInput";
import { useScreen } from "usehooks-ts";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

const options: MotionProps["variants"] = {
  "partial-inital": (isFullScreen: boolean) => {
    return {
      opacity: 0,
      scale: 0.5,
    };
  },
  "partial-animate": {
    opacity: 1,
    scale: 1,
    // height: 12,
    // width: 12,
  },
  "partial-exit": (isFullScreen: boolean) => {
    return {
      opacity: 0,
      scale: 0,
    };
  },
  "full-inital": {
    opacity: 0,
    scale: 0.5,
  },
  "full-exit": (isFullScreen: boolean) => {
    return {
      opacity: 0,
      scale: 0,
      // top: isFullScreen ? 0 : 8,
      // left: isFullScreen ? 0 : -56,
    };
  },
  "full-animate": {
    opacity: 1,
    scale: 1,
    // height: "100vh",
    // width: "100vw",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

type DataType = {
  from: [longitude: number, latitude: number];
  to: [longitude: number, latitude: number];
};

export const MapMessage = ({
  message,
  onMessage,
}: {
  message: string;
  onMessage: (message: string, files: File[]) => void;
}) => {
  const [type, setMapState] = useState<"partial" | "full" | "idle">("idle");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const screen = useScreen();

  const toggleScreen = (isFullScreen: boolean) => {
    setMapState(isFullScreen ? "full" : "partial");
  };

  const onFullScreen = () => {
    setIsFullScreen((s) => {
      toggleScreen(!s);
      return !s;
    });
  };

  // Used for disablins scrolling on fulls creen
  useEffect(() => {
    const body = document.querySelector("body");
    if (body && type === "full") {
      body.classList.add("overflow-hidden");
    }
    return () => {
      if (body) {
        body.classList.remove("overflow-hidden");
      }
    };
  }, [type]);

  const payload = useMemo(() => {
    try {
      const data = JSON.parse(message);
      return {
        center: data.center || [53.55047170427367, 9.95925892152908],
        zoom: isFullScreen ? 15 : 11,
        data: data,
      };
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {
        center: [53.55047170427367, 9.95925892152908],
        zoom: isFullScreen ? 15 : 11,
      };
    }
  }, [message, isFullScreen]);

  return (
    <ErrorBoundary>
      <MotionConfig
        transition={{
          type: "spring",
          duration: type === "full" ? 0.5 : 0.2,
          bounce: 0.1,
        }}
      >
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {type === "idle" && (
              <motion.button
                initial={false}
                animate={{
                  width: 46,
                  height: 46,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.5, x: 50, y: 55 }}
                key="map-button"
                layoutId="map-container"
                className="cursor-pointer"
                onClick={() => toggleScreen(isFullScreen)}
              >
                <motion.div layout className="relative">
                  <MapIcon size={46} show={type === "idle"} />
                  <motion.div
                    key="close-button-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    layoutId="close-button"
                    className="w-1.5 h-1.5 bg-[#ff3d3d] top-1 right-1 absolute rounded-2xl z-[1000]"
                  ></motion.div>
                  <motion.div
                    className="w-0.5 h-0.5 bottom-3 left-4 absolute rounded-2xl z-[1000]"
                    layoutId="direction-container"
                  ></motion.div>
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout" custom={isFullScreen}>
            {type === "partial" && (
              <CardContainer
                key={"partial"}
                payload={payload}
                height={256}
                width={256}
                type={"partial"}
                className={"w-64 h-64 absolute rounded-2xl top-2 !-ml-32 z-5"}
                toggleFullScreen={onFullScreen}
                close={() => setMapState("idle")}
              />
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout" custom={isFullScreen}>
            {/*className={`${isFullScreen ? "fixed top-0 left-0" : "absolute rounded-2xl top-2 -left-14"} z-5`}*/}
            {type === "full" && (
              <CardContainer
                key={"full"}
                payload={payload}
                height={screen.height}
                width={screen.width}
                type={"full"}
                className={" w-screen h-screen fixed top-0 left-0"}
                toggleFullScreen={onFullScreen}
                close={() => setMapState("idle")}
              >
                <motion.div
                  initial={{ scale: 0.2, y: -100, filter: "blur(5px)" }}
                  animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ scale: 0.2, y: -100, filter: "blur(5px)" }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.1,
                    damping: 90,
                    stiffness: 1000,
                    mass: 5,
                  }}
                  className={
                    "absolute bottom-32 left-0 right-0 flex justify-center w-screen z-[1001]"
                  }
                  layoutId="direction-container"
                >
                  <div className="icon-map-container w-128 h-auto pb-4 pointer-events-auto">
                    <div className="w-full h-32">
                      <ChatInput onMessage={onMessage} />
                    </div>
                  </div>
                </motion.div>
              </CardContainer>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </ErrorBoundary>
  );
};

function CardContainer({
  type,
  className,
  height,
  width,
  payload,
  toggleFullScreen,
  close,
  children,
}: any) {
  return (
    <motion.div
      key={`${type}-map-container`}
      variants={options}
      initial={`${type}-initial`}
      animate={`${type}-animate`}
      exit={`${type}-animate`}
      className={`${className} z-[100]`}
    >
      <motion.div
        layoutId="map-container"
        className="relative rounded-2xl w-full h-full bg-white"
      >
        <motion.div
          className={`w-full h-full ${type === "partial" ? "rounded-2xl shadow-md" : ""} overflow-hidden`}
          initial={{
            height: 0,
            width: 0,
            scale: 0.1,
            filter: "blur(5px)",
          }}
          animate={{
            height,
            width,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            scale: 0,
            filter: "blur(5px)",
          }}
        >
          <MapContainer
            center={payload.center}
            zoom={payload.zoom}
            style={{
              height,
              width,
            }}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {payload.data && (
              <ReactDeckRender key={`${type}-render`} payload={payload} />
            )}
          </MapContainer>
          <div className="absolute bottom-0 left-0 right-0 z-[1000] w-full h-full pointer-events-none">
            {children}
          </div>
        </motion.div>

        <motion.button
          initial={{
            x: type === "full" ? 50 : 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: 0,
            scale: 1,
            opacity: 1,
          }}
          exit={{
            x: type === "full" ? 50 : 0,
            opacity: 0,
            filter: "blur(5px)",
          }}
          transition={{
            delay: type === "full" ? 0.1 : 0.05,
          }}
          key={`${type}-full-button`}
          // ${isFullScreen ? "top-4 left-4" : "-top-4 -left-4"}
          className={`bg-gray-100 p-2 absolute top-0.5 left-0.5 z-[1000] shadow-md rounded-4xl cursor-pointer`}
          layoutId="button-full-container"
          onClick={toggleFullScreen}
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={"black"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {type === "full" ? (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            )}
          </svg>
        </motion.button>
        <motion.button
          layout
          initial={{
            scale: 0,
            filter: "blur(5px)",
            background: type === "full" ? "#f3f4f6" : "#ff3d3d",
          }}
          animate={{
            scale: 1,
            filter: "blur(0px)",
            background: "#f3f4f6",
          }}
          exit={{
            scale: 0,
            opacity: 0,
            filter: "blur(5px)",
          }}
          transition={{
            delay: type === "full" ? 0.1 : 0.05,
          }}
          key="close-button-modal"
          layoutId="close-button"
          className={`bg-gray-100 p-2 absolute top-0.5 right-0.5 z-[1000] shadow-md rounded-4xl cursor-pointer`}
          onClick={close}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Close modal"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Close modal</title>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
