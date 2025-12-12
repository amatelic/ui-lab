import { useState } from "react";
import { AudioPresent } from "../audio/AudioPresent";
import { AudioProvider } from "../audio/useAudioContext";

export const AudioExample = () => {
  const [showButton, setShowButton] = useState(false);

  return (
    <div>
      <AudioProvider defaults={{ volume: 1, autoPlay: false }}>
        <div>
          <AudioPresent
            loop={false}
            play={true}
            // default value
            src="./sounds/paza-moduless.mp3"
          >
            {showButton && (
              <button
                key="play"
                data-volume={0.2}
                data-initial={"./sounds/water-droplet.mp3"}
                data-exit={"./sounds/book-closing.mp3"}
              >
                Play
              </button>
            )}
          </AudioPresent>
        </div>
      </AudioProvider>
      <button onClick={() => setShowButton(!showButton)}>
        {showButton ? "Hide" : "Show"}
      </button>
    </div>
  );
};
