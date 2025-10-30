import { useLayoutEffect, useCallback, useState } from "react";

export const useRect = (ref: React.RefObject<HTMLElement | null>) => {
  const [rect, setRect] = useState(() => getRect(ref.current));

  // Wrap in useCallback to keep deps stable and avoid re-registering listeners
  const handleResize = useCallback(() => {
    setRect(getRect(ref.current ?? undefined));
  }, [ref.current]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Read initial rect
    handleResize();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(element);

      // Ensure observer is cleaned up if the element or ref changes
      return () => {
        resizeObserver.disconnect();
      };
    }

    // Fallback for environments without ResizeObserver
    // Note: these events only detect viewport changes, not local element changes.
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleResize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [ref.current, handleResize]);

  return rect;
};

function getRect(element?: HTMLElement | null) {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }

  return element.getBoundingClientRect();
}
