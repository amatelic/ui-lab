import type { RefObject } from "react";

export const SafeSpace = ({
  mouseX,
  mouseY,
  triggerRef,
  submenuRef,
}: {
  mouseX: number;
  mouseY: number;
  triggerRef: HTMLElement;
  submenuRef: HTMLElement;
}) => {
  const submenuRect = submenuRef.getBoundingClientRect();
  const triggerRect = triggerRef.getBoundingClientRect();
  const isDropdownAbove = submenuRef.getAttribute("data-position") === "top";
  const spaceBetweenItems = isDropdownAbove
    ? triggerRect.top - submenuRect.bottom
    : submenuRect.top - triggerRect.bottom;

  // Adjust the path based on dropdown position
  let pathD;
  if (isDropdownAbove) {
    // Dropdown is above the trigger
    pathD = `
      M ${mouseX - submenuRect.left}, ${triggerRect.height + submenuRect.height}
      L 0, ${submenuRect.height}
      L ${submenuRect.width}, ${submenuRect.height}
      Z
    `;
  } else {
    // Dropdown is below the trigger (default)
    pathD = `
      M ${mouseX - submenuRect.left}, 0
      L 0, ${triggerRect.height + spaceBetweenItems}
      L ${submenuRect.width}, ${triggerRect.height + spaceBetweenItems}
      Z
    `;
  }

  return (
    <svg
      style={{
        position: "fixed",
        width: submenuRect.width,
        height: isDropdownAbove
          ? submenuRect.height + triggerRect.height + spaceBetweenItems
          : triggerRect.height + spaceBetweenItems,
        pointerEvents: "none",
        zIndex: 150000,
        top: isDropdownAbove ? submenuRect.top : triggerRect.top,
        left: triggerRect.left,
      }}
      id="svg-safe-area"
    >
      <path
        pointerEvents="auto"
        stroke="red"
        strokeWidth="0.4"
        fill="rgb(114 140 89 / 0.3)"
        d={pathD}
      />
    </svg>
  );
};
