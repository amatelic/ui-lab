import {
  AnimatePresence,
  motion,
  MotionConfig,
  type MotionProps,
} from "motion/react";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ReactDeckRender } from "../../../ReactDeckRender";
import { set } from "astro/zod";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

const options: MotionProps["variants"] = {
  "patial-inital": {
    opacity: 0,
    scale: 0.5,
  },
  "patial-animate": {
    opacity: 1,
    scale: 1,
    height: 128,
    width: 128,
  },
  "full-inital": {
    opacity: 0,
    scale: 0.5,
  },
  "full-animate": {
    opacity: 1,
    scale: 1,
    height: "100vh",
    width: "100vw",
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
  const [isOpen, setIsOpen] = useState(false);
  const [type, setIsFullScreen] = useState<"partial" | "full">("partial");

  const isFullScreen = type === "full";

  const toggleScreen = () => {
    setIsFullScreen(type === "partial" ? "full" : "partial");
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
    <MotionConfig transition={{ type: "spring", duration: 0.2, bounce: 0.1 }}>
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {!isOpen && (
            <motion.button
              layout
              key="map-button"
              className="bg-gray-100 p-2 absolute top-0 left-0"
              layoutId="button-container"
              onClick={() => setIsOpen(true)}
            >
              Map
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {!isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              key="map-hidden-container"
              className="pointer-none w-0 h-0 absolute top-0 left-0"
              layoutId="map-container"
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              layout
              key={`${type}-map-container`}
              variants={options}
              initial={`${type}-initial`}
              animate={`${type}-animate`}
              layoutId="map-container"
              className={`${isFullScreen ? "fixed top-0 left-0" : "absolute rounded-2xl border-2 top-2 -left-32"}  message-map z-5`}
            >
              <div className="relative rounded-2xl w-full h-full">
                {isOpen && (
                  <motion.button
                    initial={{
                      scale: 0.2,
                      x: 50,
                      filter: "blur(5px)",
                    }}
                    animate={{
                      scale: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    layout
                    key={`${type}-full-button`}
                    className={`bg-gray-100 p-2 absolute ${isFullScreen ? "top-4 left-4" : "-top-4 -left-4"} z-[450] shadow-md rounded-4xl cursor-pointer`}
                    layoutId="button-full-container"
                    onClick={toggleScreen}
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
                      {!isFullScreen ? (
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      ) : (
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      )}
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  layout
                  key="close-button"
                  className={`bg-gray-100 p-2 absolute ${isFullScreen ? "top-4 right-4" : "-top-4 -right-4"} z-[450] shadow-md rounded-4xl cursor-pointer`}
                  layoutId="button-container"
                  onClick={() => setIsOpen(false)}
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <title>Close modal</title>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <MapContainer
                    center={payload.center}
                    zoom={payload.zoom}
                    style={
                      isFullScreen
                        ? {
                            height: window.innerHeight,
                            width: window.innerWidth,
                          }
                        : { height: 256, width: 256 }
                    }
                    attributionControl={false}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <ReactDeckRender />
                  </MapContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
