import { useEffect, useState } from "react";

export const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    setPlaying(true);
    await audio.play();
  };

  const pause = () => {
    setPlaying(false);
    audio.pause();
  };

  useEffect(() => {
    audio.addEventListener("ended", async () => {
      audio.pause();
      await audio.play();
    });
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, play, pause];
};
