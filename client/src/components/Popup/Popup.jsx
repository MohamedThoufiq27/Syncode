import React, { useState } from 'react'
import { storeRoomId } from '../Navbar/storeRoomId';

export const Popup = ({setIsClicked,setRoomId}) => {
    const [inputValue,setInputValue]=useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setRoomId(inputValue.trim());
      storeRoomId(inputValue.trim());
      setIsClicked(false); // Close popup
    }
  };
  return (
    <div className='flex-wrap h-fit w-70 p-2 bg-gray-950 rounded-lg'>
        
            <h3 className='m-1.5 p-1.5 text-center text-2xl text-white bold'>Join Room</h3>
            
            <form className="m-1.5">
                <input  type="text" minLength={6} maxLength={6} onChange={(e)=>setInputValue(e.target.value)}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter 6 digit room id" required />
            </form>

            <div className='flex justify-center items-center p-1.5'>
                <button onClick={handleSubmit}  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Confirm 
                </span>
                </button>

                <button onClick={()=>{setIsClicked(false)}} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Cancel
                </span>
                </button>
        </div>
    </div>
  )
}
