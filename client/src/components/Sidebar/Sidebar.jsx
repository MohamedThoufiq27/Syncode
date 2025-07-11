import {FolderIcon} from '@heroicons/react/24/outline'
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useSharedData } from '../../hooks/useSharedData';
import { MdOutlineVideoCall } from "react-icons/md";
import Tooltip from '../Tooltip/Tooltip';

const Sidebar = () => {

  const {setSidebarOpen,sidebarOpen,hasUnread,setIsChatOpen,setHasUnread} = useSharedData();
  const handleOpenSidebar = (name) => {
    setSidebarOpen({
      ...sidebarOpen,
      isFileSystem:(!sidebarOpen.isFileSystem ? name==="isFileSystem":false),
      isGroup:(!sidebarOpen.isGroup ? name==="isGroup":false),
      isChat:(!sidebarOpen.isChat ? name==="isChat":false),
      isAskAi:(!sidebarOpen.isAskAi ? name==="isAskAi":false)
    })
  }
  const openChat = () => {
    setIsChatOpen(true);
    setHasUnread(false);
  };
  return (
    <div className='w-15 h-screen bg-gray-900 pt-2 overflow-visible'>

        <Tooltip text='Explorer'>
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-r-sm transition-all duration-150
                ${sidebarOpen.isFileSystem ? "bg-linear-to-b from-pink-600 to-violet-500" : "bg-transparent"}`}
            /> 
            <button  onClick={()=>handleOpenSidebar("isFileSystem")} 
            className='cursor-pointer p-3  rounded-lg'>
              <FolderIcon className='size-9 text-white' />
            </button>
        </Tooltip>

        <Tooltip text='Group Members'>
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-r-sm transition-all duration-150
                ${sidebarOpen.isGroup ? "bg-linear-to-b from-pink-600 to-violet-500" : "bg-transparent"}`}
            />
            <button  onClick={()=>handleOpenSidebar("isGroup")}  
            className='cursor-pointer p-3 rounded-lg'>
              <HiOutlineUserGroup className='size-9 text-white' />
            </button>
        </Tooltip>

        <Tooltip text='Message'>
             <div
              className={`absolute left-0 top-0 h-full w-1 rounded-r-sm transition-all duration-150
                ${sidebarOpen.isChat ? "bg-linear-to-b from-pink-600 to-violet-500" : "bg-transparent"}`}
            />   
            <button  onClick={()=>{
              handleOpenSidebar("isChat");
              openChat();
              }}  className='relative cursor-pointer p-3  rounded-lg'>
              <IoChatboxEllipsesOutline className='size-9 text-white' />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full z-10" />
              )}
            </button>
          
        </Tooltip>

        <Tooltip text='Ask AI ✨'>
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-r-sm transition-all duration-150
                ${sidebarOpen.isAskAi ? "bg-linear-to-b from-pink-600 to-violet-500" : "bg-transparent"}`}
            />
            <button onClick={()=>handleOpenSidebar("isAskAi")} 
            className='cursor-pointer p-3  rounded-lg'>
              <img width="240" height="240" src="https://img.icons8.com/fluency/240/bard.png" alt="bard"/>
            </button>
          
        </Tooltip>
    </div>
  )
}

export default Sidebar