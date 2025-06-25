 import React, { useState } from 'react'
import { SiJavascript, SiPython, SiCplusplus } from 'react-icons/si';
import {FaJava} from 'react-icons/fa6';




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
          onClick={() => setOpen(!open)}
          className="inline-flex w-full justify-between items-center rounded-md dark:bg-gray-800 bg-white px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <span className="flex items-center gap-2">
            {selected.icon} 
            {/* {selected.label} */}
          </span>
          {/* for dropdown arrow svg */}
          <svg className="h-5 w-5 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {open && (
        <div className={`absolute lg:left-25 lg:-top-4 mt-2 w-fit rounded-md shadow-lg bg-gray-900 z-20`}>
          <div className="p-1 lg:flex">
            {langArray.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onLanguageChange(lang.id);
                  setOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <span className="mr-2">{lang.icon}</span> 
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