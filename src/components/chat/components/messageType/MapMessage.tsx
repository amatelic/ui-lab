import {
  AnimatePresence,
  motion,
  MotionConfig,
  type MotionProps,
} from "motion/react";
import { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ReactDeckRender } from "../../../ReactDeckRender";
import { set } from "astro/zod";
import { MapIcon } from "../map/MapIcon";
import { ErrorBoundary } from "../ErrorHandling";
import ChatInput from "../../ChatInput";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

const options: MotionProps["variants"] = {
  "partial-inital": (isFullScreen: boolean) => {
    console.log("test", isFullScreen);
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
    console.log(isFullScreen);
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
    console.log(isFullScreen);
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

export const MapMessage = ({ message }: { message: string }) => {
  const [type, setMapState] = useState<"partial" | "full" | "idle">("idle");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatInputRef = useRef<HTMLDivElement>(null);

  const toggleScreen = (isFullScreen: boolean) => {
    setMapState(isFullScreen ? "full" : "partial");
  };

  const onFullScreen = () => {
    setIsFullScreen((s) => {
      toggleScreen(!s);
      return !s;
    });
  };

  const payload = useMemo(() => {
    try {
      const data = JSON.parse(message);
      return {
        center: data.center || [51.505, -0.09],
        zoom: 13,
        data: data,
      };
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {
        center: [51.505, -0.09],
        zoom: 13,
      };
    }
  }, [message]);

  return (
    <ErrorBoundary>
      <MotionConfig transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}>
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
                    animate={{ opacity: 1 }}
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
          {/*<AnimatePresence mode="popLayout">
          {type === "idle" && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              key="map-hidden-container"
              className="pointer-none w-0 h-0 absolute top-0 left-0"
            />
          )}
        </AnimatePresence>*/}
          <AnimatePresence mode="popLayout" custom={isFullScreen}>
            {/*className={`${isFullScreen ? "fixed top-0 left-0" : "absolute rounded-2xl top-2 -left-14"} z-5`}*/}
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
                height={window.innerHeight}
                width={window.innerWidth}
                type={"full"}
                className={" w-screen h-screen fixed top-0 left-0"}
                toggleFullScreen={onFullScreen}
                close={() => setMapState("idle")}
              >
                <motion.div
                  className={
                    "absolute bottom-2 left-0 right-0  w-full flex justify-center"
                  }
                  layoutId="direction-container"
                >
                  <div className="icon-map-container w-128 pointer-events-auto">
                    <ChatInput
                      ref={chatInputRef}
                      onMessage={(message: string, files: File[] = []) => {
                        console.log(message);
                      }}
                    />
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
      className={className}
    >
      <motion.div
        layoutId="map-container"
        className="relative rounded-2xl w-full h-full"
      >
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden"
          initial={{
            height: 0,
            width: 0,
            scale: 0.1,
          }}
          animate={{
            height,
            width,
            scale: 1,
          }}
          exit={{
            scale: 0,
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
            <ReactDeckRender />
          </MapContainer>
          <div className="absolute bottom-0 left-0 right-0 z-[1000] w-full h-full pointer-events-none">
            {children}
          </div>
        </motion.div>

        <motion.button
          animate={{
            x: 0,
            filter: "blur(0px)",
          }}
          exit={{
            scale: 0,
            x: 50,
            filter: "blur(5px)",
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
            filter: "blur(5px)",
            background: "#ff3d3d",
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
