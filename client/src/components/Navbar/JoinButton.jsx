import { toast } from "react-toastify";
import { useSharedData } from "../../hooks/useSharedData";
import socket from "../../socket";


export const JoinButton = () => {
  const {roomid,setRoomId,setIsClicked,isAuth} = useSharedData();
  const handleJoin = ()=>{
    if(!isAuth){
      toast.warning("Please Login Before Join");
    }
    else setIsClicked(true);
  }
  const handleLeave = () => {
    localStorage.removeItem('roomid');
    setRoomId(null);
    socket.emit('leave-room');
    toast.info("You have left the room");
  }
  
    
  return (
        <>
        {roomid ?
        <button onClick={handleLeave} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Leave 
          </span>
        </button>
        :
        <button onClick={handleJoin} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Join 
          </span>
        </button>
        }
        </>
  )
}
