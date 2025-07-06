import {FolderIcon} from '@heroicons/react/24/outline'
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useSharedData } from '../../hooks/useSharedData';
import { MdOutlineVideoCall } from "react-icons/md";

const Sidebar = () => {

  const {setSidebarOpen,sidebarOpen,hasUnread,setIsChatOpen,setHasUnread} = useSharedData();
  const handleOpenSidebar = (name) => {
    setSidebarOpen({
      ...sidebarOpen,
      isFileSystem:(!sidebarOpen.isFileSystem ? name==="isFileSystem":false),
      isGroup:(!sidebarOpen.isGroup ? name==="isGroup":false),
      isChat:(!sidebarOpen.isChat ? name==="isChat":false),
      isVideo:(!sidebarOpen.isVideo ? name==="isVideo":false)
    })
  }
  const openChat = () => {
    setIsChatOpen(true);
    setHasUnread(false);
  };
  return (
    <div className='w-15 h-screen bg-gray-900'>

        <div className='my-6 mx-2.5'>
          <button  onClick={()=>handleOpenSidebar("isFileSystem")} className=''>
            <FolderIcon className='size-9 text-white' />
          </button>
        </div>

        <div className='my-6 mx-2.5'>
          <button  onClick={()=>handleOpenSidebar("isGroup")}  className=''>
            <HiOutlineUserGroup className='size-9 text-white' />
          </button>
        </div>

        <div className='my-6 mx-2.5'>
          <button  onClick={()=>{
            handleOpenSidebar("isChat");
            openChat();
            }}  className='relative'>
            <IoChatboxEllipsesOutline className='size-9 text-white' />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full z-10" />
            )}
          </button>
        </div>

        <div className='my-6 mx-2.5'>
          <button onClick={()=>handleOpenSidebar("isVideo")} className=''>
            <MdOutlineVideoCall className='size-9 text-white' />
          </button>
        </div>
    </div>
  )
}

export default Sidebar