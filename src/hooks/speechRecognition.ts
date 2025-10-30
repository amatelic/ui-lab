import { useEffect, useState } from "react";

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

export const useSpeechRecognition = (onTranscribed: (data: string) => void) => {
  const [transcribedSpeech, setTranscribedSpeech] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  useEffect(() => {
    if (isListening) {
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        onTranscribed(text);
        setTranscribedSpeech(text);
      };
    } else {
      recognition.onend = () => {
        setTranscribedSpeech("");
      };
    }
  }, [isListening]);

  return { transcribedSpeech, isListening, startListening, stopListening };
};
