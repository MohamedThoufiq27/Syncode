// src/components/VideoChat/GlobalVideo.jsx

import { motion as _motion } from 'framer-motion';
import { useSharedData } from "../../hooks/useSharedData";
import RemoteUserVideo from "./RemoteUserVideo";
import LocalUserVideo from "./LocalUserVideo";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCallEnd } from "react-icons/md";
import {LuPinOff} from 'react-icons/lu';
import { useMemo } from 'react';

const GlobalVideo = ({ floating = false }) => {
  const {
    localVideoTrack,
    localAudioTrack,
    localVideoRef,
    joined,
    joinChannel,
    leaveChannel,
    toggleMic,
    toggleVideo,
    remoteUsers,
    pinnedUser,
    pinUser,
    unpinUser,
    members
  } = useSharedData();

  // console.log('MEMBERS ARRAY FROM SERVER:', JSON.stringify(members, null, 2));
  
  
  const memberNameMap = useMemo(() => {
    const map = {};
    members.forEach(member => {
      map[member.uid] = member.name;
    });
    return map;
  }, [members]);
  

  const renderFloatingView = () => {
    if (!joined) return null;

    const userToDisplay = (pinnedUser && pinnedUser !== 'local') 
      ? remoteUsers.find(u => u.uid === pinnedUser) 
      : { uid: 'local' };
    if (!userToDisplay) return null;

    return (
      <_motion.div
        drag
        dragMomentum={false}
        className='fixed bottom-6 right-6 w-48 h-48 rounded-full overflow-hidden shadow-2xl cursor-move z-50 border-4 border-gray-700'
      >
 
        
            {userToDisplay.uid === 'local' ? (
              <LocalUserVideo track={localVideoTrack} videoRef={localVideoRef} />
            ) : (
              <RemoteUserVideo user={userToDisplay} />
            )}
         
      </_motion.div>
    );
  };

  const renderFullView = () => {
    if (!joined) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <button
            onClick={joinChannel}
            className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Join Call
          </button>
        </div>
      );
    }

    if (pinnedUser) {
      const mainUser = pinnedUser === 'local' ? { uid: 'local' } : remoteUsers.find(u => u.uid === pinnedUser);
      const sidebarUsers = remoteUsers.filter(u => u.uid !== pinnedUser);
      if (pinnedUser !== 'local') {
        sidebarUsers.push({ uid: 'local' });
      }

      return (
        <div className="w-full h-full flex gap-4">
          <div className="flex-1 h-full relative">
            <div className="absolute top-2 left-2 z-10 px-2 py-1 text-sm bg-black bg-opacity-50 rounded-md">
              {pinnedUser === 'local' ? 'You' : (memberNameMap[pinnedUser]) }
            </div>
             <div className="w-full h-full rounded-xl overflow-hidden">
                {pinnedUser === 'local' ? (
                  <LocalUserVideo track={localVideoTrack} videoRef={localVideoRef} />
                ) : (
                  mainUser && <RemoteUserVideo user={mainUser} />
                )}
             </div>
             <button onClick={unpinUser} className="absolute bottom-4 right-4 px-3 py-1 text-xs bg-opacity-50 rounded-md">
              <LuPinOff className='size-10 text-zinc-800'/>
             </button>
          </div>
          <div className="w-1/5 flex flex-col gap-4 overflow-y-auto">
            {sidebarUsers.map(user => (
              <div key={user.uid} className="relative aspect-video w-full rounded-lg overflow-hidden cursor-pointer" onClick={() => pinUser(user.uid)}>
                {user.uid === 'local' ? (
                  <LocalUserVideo track={localVideoTrack} videoRef={localVideoRef} /> 
                ) : (
                  <RemoteUserVideo user={user} />
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black bg-opacity-50 rounded-md">
                  {user.uid === 'local' ? 'You' : `${memberNameMap[user.uid]}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Grid View
    return (
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative aspect-video w-full" onClick={() => pinUser('local')}>
          {!localAudioTrack?.enabled && (
            <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <MdMicOff size={22} className="text-white" />
            </div>
          )}
          <div className="w-full h-full rounded-lg overflow-hidden">
            <LocalUserVideo track={localVideoTrack} videoRef={localVideoRef} />
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 text-sm bg-black bg-opacity-50 rounded-md">You</div>
        </div>
        
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative aspect-video w-full" onClick={() => pinUser(user.uid)}>
            <RemoteUserVideo user={user} />
            <div className="absolute bottom-2 left-2 px-2 py-1 text-sm bg-black bg-opacity-50 rounded-md">{memberNameMap[user.uid]}</div>
          </div>
        ))}
      </div>
    );
  };

  if (floating) {
    return renderFloatingView();
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 flex flex-col relative">
      {renderFullView()}
      {joined && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-800 p-3 rounded-full shadow-lg">
          <button
            onClick={toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${localAudioTrack?.enabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {localAudioTrack?.enabled ? <MdMic size={28} /> : <MdMicOff size={28} />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${localVideoTrack?.enabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {localVideoTrack?.enabled ? <MdVideocam size={28} /> : <MdVideocamOff size={28} />}
          </button>
          
          <button
            onClick={leaveChannel}
            className="w-16 h-14 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <MdCallEnd size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalVideo;