
import { useEffect, useRef, useState } from 'react';
import { SharedDataContext } from './SharedDataContextContext.jsx';
import socket from '../socket.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import {  decompressFromBase64 } from 'lz-string';
import {useParams} from 'react-router-dom'
import { getRoomId } from '../components/Navbar/storeRoomId.js';

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



export const SharedDataProvider = ({ children }) => {
    const auth = getAuth();
    const {roomid:UrlRoomid} = useParams();
    const [roomid, setRoomId] = useState(()=>{
        return UrlRoomid || getRoomId();
    });
    const [IsClicked, setIsClicked] = useState(false);
    const [username, setUserName] = useState(null);
    const [members,setMembers] = useState([]);
    const [isAuth,setIsAuth] = useState(false);
    const [chat,setChat] = useState([]);
    const [language,setLanguage] = useState('javascript');
    const [code,setCode]=useState(defaultCodeSnippets[language]);
    const [tree,setTree] = useState();
    const [socketId,setSocketId] = useState(null);
    const [message,setMessage] = useState('');
    const isChatOpenRef = useRef(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [GeneratedCode,setGeneratedCode] = useState([]);
    
    
    const [selectedFile,setSelectedFile] = useState({
        name:null,
        isfolder:false,
        content:null
    }) ;
    const [sidebarOpen, setSidebarOpen] = useState({
        isChat: false,
        isGroup: false,
        isFileSystem: false,
        isAskAi:false
    });

    
   

    //sync file system
    useEffect(()=>{
        socket.on("tree-update",(compressedTree)=>{
            if (typeof compressedTree !== "string") {
                console.error("🚨 Expected string but got:", compressedTree);
                return;
            }
            const decompressed = JSON.parse(decompressFromBase64(compressedTree));
            console.log("📥 Received tree-update:", decompressed);
            setTree(decompressed);
        });

    
        return ()=>{
            socket.off("tree-update");
        };
    },[]);
   
    
    // to get room members when joined
    useEffect(() => {
        socket.on('members-update', (updatedMembers) => {
            console.log("📥 members-update received", updatedMembers);
            setMembers(updatedMembers);
        });

        return () => {
            socket.off('members-update');
        };
    }, []);

    //to join room 
    useEffect(() => {
        if (!roomid || !username) return;

        const join = () => {
            console.log("🚀 Emitting join-room", { roomid, username });
            socket.emit('join-room', { roomid, username });
        };

        if (socket.connected) {
            setSocketId(socket.id);
            join();
        } else {
            socket.once('connect', join);
        }
        
        return ()=>{
            socket.disconnect();
        };
    }, [roomid, username]);


    //for auth the user when logged in
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user!=null){
                setUserName(user.displayName);
                setIsAuth(true);
                if(user.displayName){
                    toast.success(`Logged in as ${user.displayName}`)
                }
            }else{
                setUserName(null);
            }
        });


        return ()=>unsubscribe();
    },[]);

    // 
    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);   

    //for receiving messages from others
    useEffect(()=>{
        socket.on('receive-message',(data)=>{
            setChat((prev)=>[...prev,data]);
            if (!isChatOpenRef.current) {
                setHasUnread(true);
                toast.info('New Message !')
            }
        })
        
        return ()=>{
            socket.off('receive-message');
        }
    },[roomid,message])

    useEffect(() => {
        if (!sidebarOpen.isChat) {
            setIsChatOpen(false); // 🔁 Sync isChatOpen state
        }
    }, [sidebarOpen.isChat]);

  
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
        setIsAuth,
        chat,
        setChat,
        selectedFile,
        setSelectedFile,
        code,
        language,
        setCode,
        setLanguage,
        defaultCodeSnippets,
        tree,
        setTree,
        socketId,
        message,
        setMessage,
        setIsChatOpen,
        hasUnread,
        setHasUnread,
        isChatOpen,
        openFiles,
        setActiveFile,
        setOpenFiles,
        activeFile,
        GeneratedCode,
        setGeneratedCode
    };

    return (
        <SharedDataContext.Provider value={value}>
            {children}
        </SharedDataContext.Provider>
    );
};

