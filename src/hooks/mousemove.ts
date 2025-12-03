import { useEffect, useState } from "react";

export const useMousePosition = (
  element: HTMLElement | Window | null = window,
) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    // Adjusted mouse position (mouse - scroll)
    adjustedX: 0,
    adjustedY: 0,
  });

  useEffect(() => {
    if (!element) return;

    const updateMousePosition = (ev: MouseEvent) => {
      const scrollX =
        element instanceof Window ? element.scrollX : element.scrollLeft;
      const scrollY =
        element instanceof Window ? element.scrollY : element.scrollTop;

      setPosition({
        x: ev.clientX,
        y: ev.clientY,
        scrollX,
        scrollY,
        adjustedX: ev.clientX + scrollX,
        adjustedY: ev.clientY + scrollY,
      });
    };

    const updateScrollPosition = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      setPosition((prev) => ({
        ...prev,
        scrollX,
        scrollY,
        adjustedX: prev.x + scrollX,
        adjustedY: prev.y + scrollY,
      }));
    };

    element.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("scroll", updateScrollPosition, {
      passive: true,
    });

    // Initialize scroll and mouse position
    updateScrollPosition();

    return () => {
      element.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, [element]);

  return position;
};

export default useMousePosition;
