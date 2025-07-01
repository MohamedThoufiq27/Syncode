 import React, { useState } from 'react'
import { SiJavascript, SiPython, SiCplusplus } from 'react-icons/si';
import {FaJava} from 'react-icons/fa6';
import { FaCaretRight } from "react-icons/fa6";
import { toast } from 'react-toastify';




 const langArray = [
      {id:'javascript',icon:<SiJavascript className='text-yellow-400 rounded-xs w-8 h-8'/>,label:'JavaScript'},
      {id:'python',icon:<SiPython className='text-blue-400 w-8 h-8'/>,label:'Python'},
      {id:'java',icon:<FaJava className='text-red-600 w-8 h-8'/>,label:'Java'},
      {id:'cpp',icon:<SiCplusplus className='text-blue-500 w-8 h-8'/>,label:'C++'}
 ];

const Dropdown = ({language,onLanguageChange}) => {

  const [open, setOpen] = useState(false);

  const selected = langArray.find((lang) => lang.id === language);

 
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onMouseOver={() => setOpen(true)}
          className="inline-flex w-full justify-between items-center rounded-md dark:bg-gray-800 bg-white px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <span className="flex items-center gap-2">
            {selected.icon} 
            {/* {selected.label} */}
          </span>
          {/* for dropdown arrow svg */}
          <span className='ml-1'><FaCaretRight /></span>
        </button>
      </div>
      {open && (
        <div onMouseLeave={()=>setOpen(false)} className={`absolute lg:left-25 lg:-top-4 mt-2 w-fit rounded-md shadow-lg bg-gray-900 z-20`}>
          <div className="p-1 lg:flex">
            {langArray.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onLanguageChange(lang.id);
                  setOpen(false);
                  toast.success(`${lang.label} Selected Successfully !`)
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <span className="">{lang.icon}</span> 
                {/* {lang.label} */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown