import { useRef, useEffect, useState } from "react";

type UseWithSoundReturn = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  playing: boolean;
  toggle: () => Promise<void>;
  analyser: AnalyserNode | null;
};

export const useWithSound = (audioSource: string): UseWithSoundReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(audioSource);
    audioRef.current = audio;
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;

    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      ctx.close();
    };
  }, [audioSource]);

  const toggle = async () => {
    if (!audioRef.current || !audioCtxRef.current) {
      throw new Error("Audio or AudioContext is not initialized");
    }

    const audio = audioRef.current;
    const ctx = audioCtxRef.current;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    // Resume AudioContext if suspended
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Set up the Web Audio graph BEFORE playing
    if (!sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audio);
      analyserRef.current = ctx.createAnalyser();
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch (e) {
      console.error("Playback failed", e);
    }
  };

  const stop = () => {
    setPlaying(false);
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      setPlaying(false);
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  return {
    canvasRef,
    playing,
    stop,
    toggle,
    analyser: analyserRef.current,
  };
};
