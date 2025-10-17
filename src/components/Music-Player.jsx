// src/components/MusicPlayer.jsx
import React from 'react';

function MusicPlayer() {
  return (
    <div className="music-player flex flex-col items-center rounded-md">
      {/* Lightweight SoundCloud Embed */}
      <iframe 
        width="100%" 
        height="166" 
        scrolling="no" 
        frameBorder="no" 
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/joshua-leyva-993344027/lofi&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default MusicPlayer;

