/**
 * AudioPlayer - Audio playback component for call recordings
 *
 * Features:
 * - Play/pause controls
 * - Seek bar
 * - Current time / duration
 * - Volume control
 * - Playback speed control
 */

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface AudioPlayerProps {
  src: string;
  callId?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
  bgClassName?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  callId,
  title,
  onTimeUpdate,
  className,
  bgClassName = "bg-white",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds)
    );
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn(bgClassName, "rounded-lg p-4", className)}>
      {/* Header */}
      {(title || callId) && (
        <div className="mb-4">
          {title && (
            <h4 className="text-base font-semibold text-neutral-900">
              {title}
            </h4>
          )}
          {callId && (
            <p className="text-sm text-neutral-500">Call ID: {callId}</p>
          )}
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Skip Back */}
          <button
            onClick={() => skip(-10)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
            title="Skip back 10s"
          >
            <SkipBack className="w-5 h-5 text-neutral-700" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-sm transition shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white fill-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white" />
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => skip(10)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
            title="Skip forward 10s"
          >
            <SkipForward className="w-5 h-5 text-neutral-700" />
          </button>

          {/* Playback Speed */}
          <button
            onClick={changePlaybackRate}
            className="px-3 py-1 hover:bg-neutral-100 rounded-lg transition text-sm font-medium text-neutral-700"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Right Controls - Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-neutral-700" />
            ) : (
              <Volume2 className="w-5 h-5 text-neutral-700" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
