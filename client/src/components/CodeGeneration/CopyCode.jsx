import { useState } from 'react'
import { IoCopy } from "react-icons/io5";
import { TbCopyCheckFilled } from "react-icons/tb";
import {toast} from 'react-toastify';

const CopyCode = ({textToCopy}) => {
    const [copy,setCopy] = useState(false);
    const handleCopy = async () => {
        try{
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Code Copied !");
            setCopy(true);
            setTimeout(()=>{
                setCopy(false);
                
            },1500);
        }
        catch(err){
            console.error('Failed to Copy Code !',err);
        }
        
    }
  return (
    <div onClick={handleCopy} className='p-0.5 inline-flex justify-end w-full'>
        { !copy ?
            <IoCopy className='h-5 w-5 dark:text-white text-black'/>
            :
            <TbCopyCheckFilled className='h-6 w-6 dark:text-white text-black'/>
         
        }
        
    </div>
    
  )
}

export default CopyCode