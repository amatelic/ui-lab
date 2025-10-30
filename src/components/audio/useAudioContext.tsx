import {
  createContext,
  useContext,
  useState,
  useRef,
  type PropsWithChildren,
  type HtmlHTMLAttributes,
} from "react";

interface AudioContextProps {
  defaults: {
    volume: number;
    autoPlay: boolean;
  };
}

function cleanKey(key: string) {
  if (!key) return key;
  return key.replace(/^[\$.]+/, "");
}

const AudioContext = createContext({
  volume: 1,
  setVolume: (value: number) => {},
  getAudio: (key: string): HTMLAudioElement | undefined => undefined,
  removeAudio: (key: string) => {},
  setAudio: (key: string, audio: HTMLAudioElement) => {},
});
// global volume
export const AudioProvider = (
  { children, defaults }: PropsWithChildren<AudioContextProps> = {
    defaults: {
      volume: 1,
      autoPlay: false,
    },
  },
) => {
  const [volume, setVolume] = useState(defaults?.volume ?? 1);
  const audioRef = useRef<Record<string, HTMLAudioElement>>({});

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };
  const getAudio = (key: string) => {
    return audioRef.current?.[key];
  };
  const setAudio = (key: string, audio: HTMLAudioElement) => {
    if (!audioRef.current) {
      return;
    }
    // React add $. to the key so we are removing this
    audioRef.current[cleanKey(key)] = audio;
  };
  const removeAudio = (key: string) => {
    if (!audioRef.current) {
      return;
    }
    delete audioRef.current[key];
  };

  return (
    <AudioContext.Provider
      value={{
        volume,
        setVolume: handleVolumeChange,
        getAudio,
        setAudio,
        removeAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext(AudioContext);
