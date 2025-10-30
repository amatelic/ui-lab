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
import { useRect } from "../../../hooks/userRect";

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
  const triggerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);
  const trigerRect = useRect(triggerRef);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setTimeout(() => setIsOpen(false), 200);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current!;
      const dropdown = dropdownRef.current!;
      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Calculate absolute position
      let top = triggerRect.bottom + scrollY;
      let left = triggerRect.left + scrollX;

      // Flip up if not enough space below
      if (triggerRect.bottom + dropdownRect.height > window.innerHeight) {
        top =
          triggerRect.top + scrollY - dropdownRect.height - triggerRect.height;
        dropdown.setAttribute("data-position", "top");
      } else {
        dropdown.removeAttribute("data-position");
      }

      // Center if not enough space on either side
      if (triggerRect.left + dropdownRect.width > window.innerWidth) {
        left = triggerRect.right + scrollX - dropdownRect.width;
      }

      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, trigerRect]);

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
        <SafeSpace
          triggerRef={triggerRef.current}
          submenuRef={dropdownRef.current}
          mouseX={x}
          mouseY={y}
        />
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
            className={`hover-dropdown fixed ${!isOpen ? "hover-dropdown-closing bg-white" : ""}`}
            role="menu"
            tabIndex={0}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
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
