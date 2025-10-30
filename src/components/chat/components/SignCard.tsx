import { AnimatePresence, motion, stagger } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Path = Point[];

const buttonAnimation = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: stagger(0.1),
    },
  },
  hidden: { opacity: 0, scale: 0.2 },
  children: {
    hidden: {
      opacity: 0,
      scale: 0,
      transition: { delay: 0.15, type: "spring" },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.25, type: "spring" },
    },
  },
};

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="-10 -10 40 40"
      aria-label="Pencil cursor"
    >
      <g transform="rotate(-15)">
        <path
          d="
          M 0 0
          L 4 -1
          Q 10 -3 20 -1
          L 26 -1
          L 26 1
          L 20 1
          Q 10 3 4 1
          L 0 0
          Z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

export const SignCard = () => {
  const [isOpend, setIsOpend] = useState(false);
  const [signatureDataURL, setSignatureDataURL] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [color, setColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);

  const isDrawingRef = useRef(false);
  const pathsRef = useRef<Path[]>([]);
  const currentPathRef = useRef<Path>([]);

  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));

  function setupCanvas() {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      preserveDrawingBuffer: true,
    });

    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushWidth;
  }

  useEffect(() => {
    // hack for when opening card the second time
    setTimeout(() => {
      setupCanvas();
    }, 500);
  }, [isOpend]);

  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw all completed paths
    for (const path of pathsRef.current) {
      drawSmoothPath(ctx, path, brushWidth, color);
    }
    // Draw the current in-progress path
    if (currentPathRef.current.length > 0) {
      drawSmoothPath(ctx, currentPathRef.current, brushWidth, color);
    }
  };

  const drawSmoothPath = (
    ctx: CanvasRenderingContext2D,
    path: Path,
    width: number,
    strokeStyle: string,
  ) => {
    if (path.length < 2) return;

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length - 1; i++) {
      const mid = getMidPoint(path[i - 1], path[i]);
      ctx.quadraticCurveTo(path[i - 1].x, path[i - 1].y, mid.x, mid.y);
    }
    // Draw to the last point
    const last = path[path.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  };

  const getMidPoint = (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawingRef.current = true;
    if (e.pointerId) {
      canvas.setPointerCapture?.(e.pointerId);
    }
    const { x, y } = getCanvasPoint(e);
    currentPathRef.current = [{ x, y }];
    redrawCanvas();
  };

  const getCanvasPoint = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.PointerEvent | React.MouseEvent).clientX;
      clientY = (e as React.PointerEvent | React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const { x, y } = getCanvasPoint(e);
    const current = currentPathRef.current;
    const last = current[current.length - 1];

    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy < 0.3) return; // ignore tiny moves
    }

    current.push({ x, y });
    redrawCanvas();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentPathRef.current.length > 0) {
      pathsRef.current = [...pathsRef.current, currentPathRef.current];
      currentPathRef.current = [];
    }
    redrawCanvas();
  };

  const clearCanvas = () => {
    pathsRef.current = [];
    currentPathRef.current = [];
    redrawCanvas();
  };

  return (
    <div>
      <motion.div>
        <motion.div
          layout
          key="card-container-init"
          layoutId="card-container"
          className="w-1 h-1"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 750,
            damping: 65,
            mass: 2,
          }}
        ></motion.div>
        <motion.button
          layout
          disabled={!!signatureDataURL}
          key="sign-button-init"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 750,
            damping: 65,
            mass: 2,
          }}
          className={`${signatureDataURL ? "bg-gray-100 cursor-not-allowed py-1 px-2" : "bg-[#221911] py-2 px-4"} text-white font-bold rounded-2xl z-1`}
          onClick={() => {
            if (!signatureDataURL) {
              setIsOpend(!isOpend);
            }
          }}
          layoutId="card-button"
        >
          {signatureDataURL ? (
            <motion.img
              className="w-18 h-8 py-1 px-2"
              src={signatureDataURL}
              alt="Signature"
            />
          ) : (
            <motion.span className="!text-white">Sign Document</motion.span>
          )}
        </motion.button>
        <AnimatePresence mode="popLayout" initial={false}>
          {isOpend && (
            <motion.div
              key="card-container"
              layoutId="card-container"
              ref={cardRef}
              className="signing relative shadow-md p-4 rounded-2xl w-128 h-48"
              layout
              initial={{ opacity: 0 }}
              animate={buttonAnimation.visible}
              exit={{ opacity: 0 }}
            >
              {isOpend && (
                <motion.canvas
                  id="drawingCanvas"
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                ></motion.canvas>
              )}
              <motion.button
                variants={buttonAnimation.children}
                initial="hidden"
                whileInView="visible"
                exit="hidden"
                onClick={clearCanvas}
                className="absolute top-2 left-3 z-10 rounded-4xl bg-gray-100 px-1 py-1"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </motion.svg>
              </motion.button>
              <motion.button
                variants={buttonAnimation.children}
                initial="hidden"
                whileInView="visible"
                exit="hidden"
                onClick={() => {
                  clearCanvas();
                  setIsOpend(!isOpend);
                }}
                className="absolute top-2 right-3 z-10 rounded-4xl bg-gray-100 px-1 py-1"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </motion.svg>
              </motion.button>
              <div className="absolute left-0 bottom-0 flex justify-center w-full z-10 py-2">
                <motion.button
                  animate={{ scale: 1.1 }}
                  onClick={() => {
                    setSignatureDataURL(canvasRef.current?.toDataURL() || "");
                    clearCanvas();
                    setIsOpend(!isOpend);
                  }}
                  className={`z-20 bg-gray-100 px-3 py-2 !font-bold rounded-2xl`}
                  layoutId="card-button"
                >
                  Finish signing
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
