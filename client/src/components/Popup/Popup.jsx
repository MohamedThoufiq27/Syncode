import  { useState } from 'react'
import { storeRoomId } from '../Navbar/storeRoomId';
import { useSharedData } from '../../hooks/useSharedData';
import {v4 as uuidv4 } from 'uuid';


export const Popup = () => {
    const {setIsClicked,setRoomId} = useSharedData();
    const [inputValue,setInputValue]=useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (inputValue.trim().length > 0) {
        setRoomId(inputValue.trim());
        storeRoomId(inputValue.trim());
        setIsClicked(false); // Close popu
      }
    };

    const handleGenerateId = () => {
      const newuuid = uuidv4();
      console.log(newuuid);
      setInputValue(newuuid);
    }
  return (
    <div className='h-fit w-fit p-6 bg-gray-950 rounded-lg opacity-100'>
        
            <h3 className='text-center text-2xl text-white bold'>Join Room</h3>
            
            <form className="m-1.5">
                <input autoFocus value={inputValue}  type="text" minLength={6} maxLength={6} onChange={(e)=>setInputValue(e.target.value)}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter 6 digit room id" required />
            </form>

            <div className='flex justify-center items-center py-1 pl-1.5'>
                <button onClick={handleSubmit}  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Confirm 
                </span>
                </button>

                <button onClick={()=>handleGenerateId()} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Generate ID
                </span>
                </button>
                
            </div>
            <div className='w-full'>
                <button onClick={()=>{setIsClicked(false)}} className="w-full flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Cancel
                </span>
                </button>
            </div>
          
    </div>
  )
}
