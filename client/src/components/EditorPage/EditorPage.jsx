
import {  useState } from 'react'
import CodeEditor from './CodeEditor'
import { Navigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'

const EditorPage = ({roomid,setRoomId,IsClicked,setIsClicked}) => {
    const [language,setLanguage] = useState('javascript');
    const [output,setOutput] = useState('');
    const [Loading,setLoading] = useState(false);
    const [runTime,setRunTime] = useState('');
    const [input,setInput] = useState('');
  return (
    <main className=' grid grid-cols-5 grid-rows-7 gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 dark:bg-gray-900 bg-white w-screen h-screen'>
          <div className='col-span-5 col-start-1 row-start-1'>
            <Navbar roomid={roomid} setRoomId={setRoomId} IsClicked={IsClicked} setIsClicked={setIsClicked} />
          </div>
          {console.log(roomid)}
          {roomid ? 
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
            :
            // <div className='flex justify-center items-center'>
            
            
            <Navigate to="/" />
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
  )
}

export default EditorPage