import { useEffect, useRef, useState } from 'react';
import { SharedDataContext } from './SharedDataContextContext.jsx';
import socket from '../socket.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { decompressFromBase64 } from 'lz-string';
import { useParams } from 'react-router-dom';
import { getRoomId } from '../components/Navbar/storeRoomId.js';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { getAgoraToken } from '../utils/get-agora-token.js';

const defaultCodeSnippets = {
  javascript: `// JavaScript Example
function greet(name) {
  return "Hello, " + name;
}
console.log(greet("World"));`,
  python: `# Python Example
def greet(name):
    return "Hello, " + name

print(greet("World"))`,
  cpp: `// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

export const SharedDataProvider = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const { roomid: UrlRoomid } = useParams();
  const [roomid, setRoomId] = useState(() => {
    return UrlRoomid || getRoomId();
  });
  const [IsClicked, setIsClicked] = useState(false);
  const [username, setUserName] = useState(null);
  const [members, setMembers] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [chat, setChat] = useState([]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodeSnippets[language]);
  const [tree, setTree] = useState();
  const [socketId, setSocketId] = useState(null);
  const [message, setMessage] = useState('');
  const isChatOpenRef = useRef(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [GeneratedCode, setGeneratedCode] = useState([]);
  const clientRef = useRef(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const localVideoRef = useRef(null);
  const [pinnedUser, setPinnedUser] = useState(null);
  const [trackState, setTrackState] = useState(0);
  const [joiningCall,setJoiningCall] = useState(false);

  const pinUser = (uid) => setPinnedUser(uid);
  const unpinUser = () => setPinnedUser(null);

  const [selectedFile, setSelectedFile] = useState({
    name: null,
    isfolder: false,
    content: null
  });
  const [sidebarOpen, setSidebarOpen] = useState({
    isChat: false,
    isGroup: false,
    isFileSystem: false,
    isAskAi: false,
    isVideoChat: false
  });

  useEffect(() => {
    socket.on("tree-update", (compressedTree) => {
      if (typeof compressedTree !== "string") {
        console.error("🚨 Expected string but got:", compressedTree);
        return;
      }
      const decompressed = JSON.parse(decompressFromBase64(compressedTree));
      setTree(decompressed);
    });

    return () => {
      socket.off("tree-update");
    };
  }, []);

  useEffect(() => {
    socket.on('members-update', (updatedMembers) => {
      setMembers(updatedMembers);
    });

    return () => {
      socket.off('members-update');
    };
  }, []);

  useEffect(() => {
    if (!roomid || !username) return;

    const join = () => {
      socket.emit('join-room', { roomid, username, uid: user.uid });
    };

    if (socket.connected) {
      setSocketId(socket.id);
      join();
    } else {
      socket.once('connect', join);
    }

    return () => {
      socket.disconnect();
    };
  }, [roomid, username]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUserName(user.displayName);
        setIsAuth(true);
        if (user.displayName) {
          toast.success(`Logged in as ${user.displayName}`)
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setChat((prev) => [...prev, data]);
      if (!isChatOpenRef.current) {
        setHasUnread(true);
        toast.info('New Message !')
      }
    })

    return () => {
      socket.off('receive-message');
    }
  }, [roomid, message])

  useEffect(() => {
    if (!sidebarOpen.isChat) {
      setIsChatOpen(false);
    }
  }, [sidebarOpen.isChat]);

  useEffect(() => {
    clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const client = clientRef.current;

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        setRemoteUsers((prev) => [...prev, user]);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    return () => {
        console.error("!!! SHARED DATA PROVIDER IS UNMOUNTING! THIS WILL DESTROY THE VIDEO STATE. !!!");
      leaveChannel();
    };
  }, []);

  const leaveChannel = async () => {
    // ✅ 1. Update the state immediately
    setJoined(false);
    unpinUser(); 

    // 2. Then, perform the cleanup
    const client = clientRef.current;
    if (localAudioTrack) {
      localAudioTrack.close();
      setLocalAudioTrack(null);
    }
    if (localVideoTrack) {
      localVideoTrack.close();
      setLocalVideoTrack(null);
    }
    setRemoteUsers([]);
    
    // 3. The async operation now happens last
    await client.leave();
  };

  const joinChannel = async () => {
    const client = clientRef.current;
    if (!user) {
      console.error("🚨 User not authenticated. Cannot join channel.");
      return;
    }

    try {
      setJoiningCall(true);
      console.log("🚀 Attempting to join channel...");
      const TOKEN = await getAgoraToken(roomid, user.uid);
      await client.join(APP_ID, roomid, TOKEN.token, user.uid);

      console.log("🎤 Creating audio track...");
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      
      console.log("📹 Creating video track...");
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      console.log("✅ Tracks created successfully.", { audioTrack, videoTrack });

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await client.publish([audioTrack, videoTrack]);
      setJoined(true);
      console.log("🎉 Joined and published successfully!");
      setJoiningCall(false);

    } catch (error) {
      console.error("❌ Failed to join or create tracks:", error);
    }
  };
  
  const toggleMic = async () => {
    if (localAudioTrack) {
        const isCurrentlyEnabled = localAudioTrack.enabled;
       
        await localAudioTrack.setEnabled(!isCurrentlyEnabled);
         setTrackState(prev => prev + 1);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
        const isCurrentlyEnabled = localVideoTrack.enabled;
       
        await localVideoTrack.setEnabled(!isCurrentlyEnabled);
         setTrackState(prev => prev + 1);
    }
  };

  const value = {
    roomid, setRoomId,
    IsClicked, setIsClicked,
    username, setUserName,
    sidebarOpen, setSidebarOpen,
    members, setMembers,
    isAuth, setIsAuth,
    chat, setChat,
    selectedFile, setSelectedFile,
    code, language,
    setCode, setLanguage,
    defaultCodeSnippets,

    tree, setTree,
    socketId,

    message, setMessage,
    setIsChatOpen,
    hasUnread, setHasUnread,
    isChatOpen,

    openFiles, setActiveFile,
    setOpenFiles, activeFile,
    GeneratedCode, setGeneratedCode,

    remoteUsers, clientRef,
    setRemoteUsers,
    joined,
    localVideoRef,
    joinChannel, leaveChannel,
    pinnedUser, pinUser, unpinUser,
    toggleMic, toggleVideo,
    localAudioTrack, localVideoTrack,
    trackState,
    joiningCall
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};