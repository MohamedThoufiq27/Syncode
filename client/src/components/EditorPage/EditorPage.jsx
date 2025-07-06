
import {  useEffect, useState } from 'react'
import CodeEditor from './CodeEditor'
import { Navigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { getRoomId } from '../Navbar/storeRoomId'
import { toast } from 'react-toastify'
import Sidebar from '../Sidebar/Sidebar'
import { useSharedData } from '../../hooks/useSharedData'
import ChatBox from '../Chat/ChatBox'
import Group from '../Group/Group'
import VideoChat from '../VideoChat/VideoChat'
import FileSystem from '../FileSystem/FileSytem'



const EditorPage = () => {
    const {roomid,sidebarOpen,isAuth,language,setLanguage} = useSharedData();
    const [output,setOutput] = useState('');
    const [Loading,setLoading] = useState(false);
    const [runTime,setRunTime] = useState('');
    const [input,setInput] = useState('');
    

    useEffect(()=>{
      if(!getRoomId()) return ;
      toast.success(`you joined the room Successfully !`)
    },[])

  
    if(!getRoomId() || !isAuth){
      return <Navigate to={'/'}/>
    }
  return (

    <div className='flex'>
      <Sidebar />
      {sidebarOpen.isChat && 
        <div className='w-[25vw] h-screen p-4 bg-gray-900'>
          <div className='w-[23vw] h-full bg-linear-to-b from-fuchsia-300 to-fuchsia-700 rounded-2xl'>
            <ChatBox/>
          </div>
        </div>
      }
      {sidebarOpen.isGroup && 
        
        <div className='w-[17vw] h-screen p-4 bg-gray-900'>
          <div className='w-[15vw] h-full bg-linear-to-b from-fuchsia-300 to-fuchsia-700 rounded-2xl'>
            <Group/>
          </div>
        </div>
        
      }
      {sidebarOpen.isFileSystem &&
        <div className='w-[17vw] h-screen p-4 bg-gray-900'> 
          <div className='w-[15vw] h-full bg-linear-to-b from-fuchsia-300 to-fuchsia-700 rounded-2xl overflow-auto'>
            <FileSystem />
          </div>
        </div>
      }
      {sidebarOpen.isVideo && 
        <div className='w-[17vw] h-screen p-4 bg-gray-900'>
          <div className='w-[15vw] h-full bg-linear-to-b from-fuchsia-300 to-fuchsia-700 rounded-2xl'>
            <VideoChat />
          </div>
        </div>
      }
    <main className=' grid grid-cols-5 grid-rows-7 gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 dark:bg-gray-900 bg-white w-screen h-screen'>
          <div className='col-span-5 col-start-1 row-start-1'>
            <Navbar  />
          </div>

          
          {roomid && 
            // <div className='p-1 mx-1.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500'>
            <div className='mb-3 ml-3 col-span-3 row-span-6 col-start-1 row-start-2 overflow-hidden text-sm rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500'>
              <CodeEditor 
                roomid={roomid}  
                language={language} 
                setLanguage={setLanguage} 
                setOutput={setOutput} 
                setLoading={setLoading} 
                setRunTime={setRunTime}
                Loading={Loading}
                input={input}
              />
            </div> 
           
            // <div className='flex justify-center items-center'>
            
            
            // <Navigate to="/" />
          }

          {roomid &&
            <div className='col-span-2 row-span-2 col-start-4 row-start-2 p-2.5 mr-3  font-medium rounded-md bg-gradient-to-br from-purple-500 to-pink-500'>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
                className="w-full h-full dark:bg-gray-700 bg-white overflow-auto dark:text-white text-zinc-950 p-3 rounded-lg resize-none outline-none font-mono whitespace-pre"
              />
            </div>
          }
          
          {roomid && 
            <div className='col-span-2 row-span-4 col-start-4 row-start-4 p-2.5 mr-3 mb-3 text-sm font-medium rounded-md group bg-gradient-to-br from-purple-500 to-pink-500'>
                <pre className="p-3 overflow-auto dark:bg-gray-700 bg-white dark:text-white text-zinc-950 rounded-lg h-full">
                    {!Loading && output}
                    {!Loading && output && '\n\nExecuted in : '+runTime+' ms'}
                   
                </pre>
            </div>          
          }

    </main>
    </div>
  )
}

export default EditorPage