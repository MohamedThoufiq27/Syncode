
import React, { useEffect } from 'react';

const LocalUserVideo = ({ track, videoRef }) => {
  useEffect(() => {
    // This effect runs whenever this component is mounted on the screen.
    if (track && videoRef.current) {
      // It attaches the video stream to its specific div.
      track.play(videoRef.current);
    }
    
    // When the component is unmounted (e.g., switching views), it stops the track.
    return () => {
      track?.stop();
    };
  }, [track, videoRef]); // It re-runs if the track itself ever changes.

  return <div ref={videoRef} className="w-full h-full bg-black"></div>;
};

export default LocalUserVideo;