import { useState } from "react";
import { AudioPresent } from "../audio/AudioPresent";
import { AudioProvider, useAudioContext } from "../audio/useAudioContext";
import { ErrorBoundary } from "../chat/components/ErrorHandling";

export const AudioInnerExample = () => {
  const [showButton, setShowButton] = useState(false);
  const { getAudio, setVolume } = useAudioContext();
  const playSound = (key: string) => {
    const audio = getAudio(key);
    if (audio) {
      audio.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        {/* Header with mute button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800">Audio Controls</h2>
          <button
            onClick={() => setVolume(0)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Mute
          </button>
        </div>

        {/* Audio content area */}
        <div className="min-h-[200px] flex items-center justify-center">
          <AudioPresent
            loop={false}
            play={true}
            src="./sounds/paza-moduless.mp3"
          >
            {showButton && (
              <div className="pt-2 w-full">
                <button
                  key="play-1"
                  data-volume={0.2}
                  data-initial="./sounds/water-droplet.mp3"
                  data-exit="./sounds/book-closing.mp3"
                  onClick={() => playSound("play")}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Basic Sound Example
                </button>
              </div>
            )}
            <div className="pt-2 w-full">
              <button
                key="test"
                data-volume={0.2}
                onClick={() => playSound("test")}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Simple Sound Example
              </button>
            </div>
          </AudioPresent>
        </div>

        {/* Toggle button at bottom */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowButton(!showButton)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            {showButton ? "Hide" : "Show"} Audio Buttons
          </button>
        </div>
      </div>
    </div>
  );
};

export const AudioExample = () => {
  return (
    <ErrorBoundary>
      <AudioProvider defaults={{ volume: 1, autoPlay: false }}>
        <AudioInnerExample />
      </AudioProvider>
    </ErrorBoundary>
  );
};
