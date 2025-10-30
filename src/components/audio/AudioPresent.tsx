import React, {
  useEffect,
  useRef,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { useAudioContext } from "./useAudioContext";

function traverseToLastChild(element: ReactElement) {
  if (!React.isValidElement(element)) {
    return [];
  }

  const traversalPath = [element];
  let currentElement = element;

  while (currentElement.props && currentElement.props.children) {
    const children = React.Children.toArray(currentElement.props.children);

    if (children.length === 0) {
      break; // No more children to traverse
    }

    // Get the last child
    const lastChild = children[children.length - 1];

    if (!React.isValidElement(lastChild)) {
      break; // Last child is not a React element
    }

    traversalPath.push(lastChild);
    currentElement = lastChild;
  }

  return traversalPath;
}

type AudioPreset = {
  play: boolean;
  loop: boolean;
  src: string;
};

interface AudioChildProps {
  key?: string | number;
  "data-initial"?: string | boolean;
  "data-exit"?: string | boolean;
  "data-volume"?: number;
}

function isValid(element: React.ReactElement<AudioChildProps>) {
  return (
    !React.isValidElement(element) ||
    typeof element === "string" ||
    !element.key
  );
}

export const AudioPresent = ({
  children,
  src,
}: PropsWithChildren<AudioPreset>) => {
  const { getAudio, setAudio, removeAudio } = useAudioContext();
  const prevChildrenRef = useRef<React.ReactNode[]>([]);

  function mountAudio(element: React.ReactElement<AudioChildProps>) {
    if (isValid(element)) {
      return;
    }
    // Create audio element
    const audio = new Audio(
      typeof element.props["data-initial"] === "string"
        ? element.props["data-initial"]
        : src,
    );
    if (element.props["data-volume"]) {
      audio.volume = element.props["data-volume"];
    }
    setAudio(element.key as string, audio);
    // // Play audio after a short delay
    if (element.props["data-initial"]) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }

  function unmountAudio(element: React.ReactElement<AudioChildProps>) {
    if (isValid(element) || !element.key) {
      return;
    }

    if (element.props["data-exit"]) {
      const audio = getAudio(element.key);

      if (!audio) {
        console.log("Audio not found for key:", element.key);
        return;
      }
      audio.src =
        typeof element.props["data-exit"] === "string"
          ? element.props["data-exit"]
          : src;
      audio
        .play()
        .catch((error: Error) => {
          console.error("Error playing audio:", error);
        })
        .finally(() => {
          removeAudio(element.key as string);
        });
    }
  }

  useEffect(() => {
    const currentChildrens = React.Children.toArray(children);
    (currentChildrens || []).forEach((currentChildren) => {
      if (!prevChildrenRef.current?.includes(currentChildren)) {
        const elements = traverseToLastChild(currentChildren as any);

        elements.forEach((el) => {
          mountAudio(el);
        });
      }
    });

    let previousNodes = prevChildrenRef.current || [];
    // remove items
    previousNodes.forEach((currentChildren, index) => {
      if (previousNodes.includes(currentChildrens)) {
        return;
      }
      const elements = traverseToLastChild(currentChildren);

      elements.forEach((el) => {
        unmountAudio(el);
      });
    });

    // Update the ref with current children
    prevChildrenRef.current = currentChildrens;
  }, [children]);

  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        // childElementRef.current[index] = child;
        return React.cloneElement(child, { ref: null } as any);
      })}
    </div>
  );
};
