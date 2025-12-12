import React, { useEffect, useRef, type PropsWithChildren } from "react";

type AudioPreset = {
  play: boolean;
  loop: boolean;
  src: string;
};

interface AudioChildProps {
  "data-initial"?: string | boolean;
  "data-exit"?: string | boolean;
  "data-volume"?: number;
}

export const AudioPresent = ({
  children,
  src,
}: PropsWithChildren<AudioPreset>) => {
  // const childElementRef = useRef<
  //   Record<
  //     string,
  //     React.ReactElement<
  //       AudioChildProps,
  //       React.JSXElementConstructor<AudioChildProps>
  //     >
  //   >
  // >({});
  const prevChildrenRef = useRef<React.ReactNode[]>([]);
  const audioRef = useRef<Record<string, HTMLAudioElement>>({});

  // initial render
  // useEffect(() => {
  //   const ch = childElementRef.current;
  //   const ad = audioRef.current;

  //   if (!ch || !ad) return;

  //   Object.keys(ch).forEach((key) => {
  //     const element = ch[key];
  //     if (element.props["data-initial"]) {
  //       // Create audio element
  //       const audio = new Audio(
  //         typeof element.props["data-initial"] === "string"
  //           ? element.props["data-initial"]
  //           : src,
  //       );
  //       if (element.props["data-volume"]) {
  //         audio.volume = element.props["data-volume"];
  //       }
  //       ad[key] = audio;

  //       // Play audio after a short delay
  //       audio.play().catch((error) => {
  //         console.error("Error playing audio:", error);
  //       });
  //     }
  //   });
  //   // const audio = new Audio(src);
  //   // audioRef.current = audio;
  // }, []);

  // exite render
  useEffect(() => {
    const currentChildrens = React.Children.toArray(children);

    if (!audioRef.current) {
      return;
    }
    (currentChildrens || []).forEach((currentChildren) => {
      if (!prevChildrenRef.current?.includes(currentChildren)) {
        const element = currentChildren;
        if (!React.isValidElement(element)) {
          return;
        }

        if (element.props["data-initial"]) {
          // Create audio element
          const audio = new Audio(
            typeof element.props["data-initial"] === "string"
              ? element.props["data-initial"]
              : src,
          );
          if (element.props["data-volume"]) {
            audio.volume = element.props["data-volume"];
          }
          audioRef.current[element.key] = audio;
          // // Play audio after a short delay
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }
      }
    });

    // remove items
    (prevChildrenRef.current || []).forEach((currentChildren, index) => {
      if (prevChildrenRef.current.includes(currentChildrens)) {
        return;
      }

      const element = currentChildren;

      if (!React.isValidElement(element)) {
        return;
      }
      if (element.props["data-exit"]) {
        // Create audio element
        const audio = audioRef.current[element.key];
        audio.src =
          typeof element.props["data-exit"] === "string"
            ? element.props["data-exit"]
            : src;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
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
