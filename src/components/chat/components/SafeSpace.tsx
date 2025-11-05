// Component for making invisible path for hover effect which are not cupled to other component
export const SafeSpace = ({
  svgWidth,
  svgHeight,
  submenuHeight,
  submenuY,
  submenuX,
  mouseX,
  mouseY,
}: {
  svgWidth: number;
  svgHeight: number;
  submenuHeight: number;
  submenuX: number;
  submenuY: number;
  mouseX: number;
  mouseY: number;
}) => {
  return (
    <svg
      style={{
        position: "fixed",
        width: svgWidth,
        height: submenuHeight,
        pointerEvents: "none",
        zIndex: 100000,
        top: submenuY - 20,
        left: submenuX - 2,
      }}
      id="svg-safe-area"
    >
      {/* Safe Area */}
      <path
        pointerEvents="auto"
        stroke="red"
        strokeWidth="0.4"
        fill="rgb(114 140 89 / 0.3)"
        d={`M  ${mouseX - submenuX}, 0
          L 0, ${submenuHeight}
          L ${svgWidth}, ${submenuHeight}
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
