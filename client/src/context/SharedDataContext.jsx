
import { useEffect, useState } from 'react';
import { SharedDataContext } from './SharedDataContextContext.jsx';
import socket from '../socket.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const SharedDataProvider = ({ children }) => {
    const auth = getAuth();
    const [roomid, setRoomId] = useState(null);
    const [IsClicked, setIsClicked] = useState(false);
    const [username, setUserName] = useState(null);
    const [members,setMembers] = useState([]);
    const [isAuth,setIsAuth] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState({
        isChat: false,
        isGroup: false,
        isFileSystem: false,
        isVideo:false
    });

    useEffect(() => {
        socket.on('members-update', (updatedMembers) => {
            console.log("📥 members-update received", updatedMembers);
            setMembers(updatedMembers);
        });

        return () => {
            socket.off('members-update');
        };
    }, []);

    useEffect(() => {
        if (!roomid || !username) return;

        const join = () => {
            console.log("🚀 Emitting join-room", { roomid, username });
            socket.emit('join-room', { roomid, username });
        };

        if (socket.connected) {
            join();
        } else {
            socket.once('connect', join);
        }


    }, [roomid, username]);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user){
                setUserName(user.displayName);
                setIsAuth(true);
            }else{
                setUserName(null);
            }
        });


        return ()=>unsubscribe();
    },[]);

  
    const value = {
        roomid,
        setRoomId,
        IsClicked,
        setIsClicked,
        username,
        setUserName,
        sidebarOpen,
        setSidebarOpen,
        members,
        setMembers,
        isAuth,
        setIsAuth
    };

    return (
        <SharedDataContext.Provider value={value}>
            {children}
        </SharedDataContext.Provider>
    );
};

