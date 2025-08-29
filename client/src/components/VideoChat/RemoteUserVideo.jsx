import React, { useEffect, useRef } from 'react';

const RemoteUserVideo = ({ user }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      console.log(`▶️ Attempting to play remote video for user ${user.uid}`);
      try {
        user.videoTrack.play(videoRef.current);
        console.log(`✅ Remote video playing for user ${user.uid}`);
      } catch (error) {
        console.error(`❌ Failed to play remote video for user ${user.uid}:`, error);
      }
    }

    return () => {
      // Cleanup: stop the track when the component is unmounted
      user.videoTrack?.stop();
    };
  }, [user.videoTrack]); // Re-run effect if the videoTrack object changes

  return <div ref={videoRef} className="w-full h-full bg-black"></div>;
};

export default RemoteUserVideo;