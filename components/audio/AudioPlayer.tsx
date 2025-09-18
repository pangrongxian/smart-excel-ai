"use client";

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  celebrity?: string;
  onDownload?: () => void;
}

export default function AudioPlayer({ src, title, celebrity, onDownload }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

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

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleLoop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <audio
        ref={audioRef}
        src={src}
        loop={isLooping}
        preload="metadata"
      />
      
      {/* 音频信息 */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
          🎤
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{title || '叫卖语音'}</h3>
          <p className="text-sm text-gray-500">{celebrity} · AI生成</p>
        </div>
        <button
          onClick={onDownload}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>📥</span>
          <span>下载</span>
        </button>
      </div>

      {/* 播放控制 */}
      <div className="space-y-4">
        {/* 进度条 */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 w-12">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-sm text-gray-500 w-12">{formatTime(duration)}</span>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={toggleLoop}
            className={`p-2 rounded-full transition-colors ${
              isLooping 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isLooping ? '关闭循环' : '开启循环'}
          >
            🔄
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}