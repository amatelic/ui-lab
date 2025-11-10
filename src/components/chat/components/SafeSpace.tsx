// Component for making invisible path for hover effect which are not cupled to other component

import type { RefObject } from "react";

export const SafeSpace = ({
  mouseX,
  mouseY,
  triggerRef,
  submenuRef,
}: {
  mouseX: number;
  mouseY: number;
  triggerRef: HTMLDivElement;
  submenuRef: HTMLDivElement;
}) => {
  const submenuRect = submenuRef.getBoundingClientRect();
  const triggerRect = triggerRef.getBoundingClientRect();
  const spaceBetweemItems = submenuRect.top - triggerRect.bottom;

  return (
    <svg
      style={{
        position: "fixed",
        width: submenuRect.width,
        height: triggerRect.height + spaceBetweemItems,
        pointerEvents: "none",
        zIndex: 100000,
        top: triggerRect.top,
        left: triggerRect.left,
      }}
      id="svg-safe-area"
    >
      {/* Safe Area */}
      <path
        pointerEvents="auto"
        stroke="red"
        strokeWidth="0.4"
        fill="rgb(114 140 89 / 0.3)"
        d={`M  ${mouseX - submenuRect.left}, 0
          L 0, ${triggerRect.bottom}
          L ${submenuRect.width}, ${triggerRect.bottom}
        z`}
      />
    </svg>
  );
};
// What did i learn
// m use for moinv  moving the element
// L1 first x1, y1 cordinates
// L2 second x1, y1 cordinates
// Z used for closing the path
