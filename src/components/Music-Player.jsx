// src/components/MusicPlayer.jsx
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player flex flex-col items-center bg-pale-cream p-4 rounded-md shadow-md">
      {/* ReactPlayer */}
      <ReactPlayer
        url='https://soundcloud.com/joshua-leyva-993344027/lofi'
        playing={isPlaying}
        controls={true}
        width="100%"
        height="100%"
        className="react-player"
      />
      
      {/* Play/Pause Button */}
      <button 
        onClick={handlePlayPause}
        className="mt-4 px-4 py-2 bg-forest-green text-pale-cream rounded-md hover:bg-forest-green-dark transition-colors focus:outline-none"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default MusicPlayer;

