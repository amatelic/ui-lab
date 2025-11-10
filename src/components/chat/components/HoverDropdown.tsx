import {
  useState,
  useRef,
  useEffect,
  Children,
  type PointerEventHandler,
  type PointerEvent,
} from "react";
import { SafeSpace } from "./SafeSpace";
import useMousePosition from "../../../hooks/mousemove";
import { createPortal } from "react-dom";

const HoverDropdown = ({
  triggerContent,
  children,
}: {
  triggerContent: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { x, y } = useMousePosition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setTimeout(() => setIsOpen(false), 200);
      }
    };
    // document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current) {
      const dropdown = dropdownRef.current;
      const trigger = triggerRef.current;
      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // X-axis: Center if not enough space on either side
      if (
        triggerRect.left + dropdownRect.width > viewportWidth ||
        triggerRect.right - dropdownRect.width < 0
      ) {
        dropdown.style.left = `${triggerRect.left + triggerRect.width / 2 - dropdownRect.width / 2}px`;
        dropdown.style.right = "auto";
      }

      // Y-axis: Flip up if not enough space below
      if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
        dropdown.setAttribute("data-position", "top");
      } else {
        dropdown.removeAttribute("data-position");
      }
    }
  }, [isOpen]);

  const handleClose = (e: PointerEvent<HTMLDivElement>) => {
    if (e.relatedTarget === window) {
      setIsOpen(false);
      return;
    }

    setTimeout(() => {
      if (containerRef.current?.contains(e.relatedTarget as Node)) {
        return;
      }
      setIsOpen(false);
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
      onPointerLeave={handleClose}
    >
      {triggerRef.current && dropdownRef.current && (
        <>
          <SafeSpace
            triggerRef={triggerRef.current}
            submenuRef={dropdownRef.current}
            mouseX={x || 0}
            mouseY={y || 0}
          />
        </>
      )}
      <div
        ref={triggerRef}
        className="hover-dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {triggerContent}
      </div>
      {isOpen &&
        triggerRef.current &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`hover-dropdown fixed ${!isOpen ? "hover-dropdown-closing" : ""}`}
            style={{
              top: triggerRef.current?.getBoundingClientRect().top + 45,
              left: triggerRef.current?.getBoundingClientRect().left,
            }}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            role="menu"
            tabIndex={0}
            aria-orientation="vertical"
          >
            {Children.map(children, (child, index) => (
              <div
                key={index}
                className="hover-dropdown-item"
                role="menuitem"
                tabIndex={0}
              >
                {child}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HoverDropdown;
