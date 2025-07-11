import { IoSend } from "react-icons/io5"
import { useSharedData } from "../../hooks/useSharedData"
import { useEffect, useRef } from "react";
import socket from '../../socket';
import Avatar from "./Avatar";

const ChatBox = () => {
  const {username,roomid,chat,setChat,socketId,message,setMessage} = useSharedData();
  
  
  const messagesEndRef = useRef(null);

  

  

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[chat])

  const sendMessage = () => {
    if(!message.trim()) return ;

      const data = {
        socketId,
        username,
        roomid,
        message
      };

    socket.emit('send-message',data);
    setChat((prev)=>[...prev,data]);
    setMessage("");
  };
  
  const now = new Date();

  const time12hr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  

  return (
    <div className="h-full rounded-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              {chat.map((msg,index)=>(
                <div key={index} className="mb-2">

                  {msg.socketId === socketId ? 
                      <div className="flex items-center justify-end">
                        <div className="flex flex-col bg-blue-500 text-white rounded-lg p-2 shadow-xl mr-2 max-w-sm">
                          {msg.message}
                          <span className="text-xs inline-flex justify-end text-zinc-600">{time12hr}</span>
                        </div>
                        <Avatar username={msg.username} senderId={msg.socketId} />
                      </div>
                  :
                    (
                      <>
                        <div className="flex items-center mb-1">
                          <Avatar username={msg.username} senderId={msg.socketId} />
                          <div className="font-medium">{msg.username}</div>
                        </div>
                        <div className="flex flex-col w-fit bg-white/20 backdrop-blur-3xl rounded-lg p-2 shadow-xl ring-black/5 max-w-sm">
                          {msg.message}
                          <span className="text-xs inline-flex justify-start text-zinc-600">{time12hr}</span>
                        </div>
                      </>
                    )
                  }

                </div>
              ))}
  
                <div ref={messagesEndRef}></div>

            </div>
        </div>



        <div className="p-2">
            <div className="flex items-center">
                <input 
                  value={message}
                  className='bg-gray-900 w-full h-[3vw] rounded-3xl focus:outline-none px-4 dark:placeholder:text-gray-500 dark:caret-gray-400 dark:text-gray-300'  
                  type='text' 
                  onChange={(e)=>setMessage(e.target.value)}
                  onKeyDown={(e)=>e.key==='Enter' && sendMessage()}
                  placeholder='Message'
                  autoFocus 
                />
                <button onClick={sendMessage} className="w-14 h-12 rounded-full bg-gray-900 text-gray-500 p-2 ml-1 flex justify-center items-center">
                  <IoSend className="size-5"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatBox