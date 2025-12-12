import {
  createContext,
  useContext,
  useState,
  useRef,
  type PropsWithChildren,
} from "react";

interface AudioContextProps {
  defaults: {
    volume: number;
    autoPlay: boolean;
  };
}

const AudioContext = createContext({
  volume: 1,
  setVolume: (value: number) => {},
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        volume,
        setVolume: handleVolumeChange,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext(AudioContext);
