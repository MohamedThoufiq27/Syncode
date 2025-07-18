import { useState } from 'react'
import { IoCopy } from "react-icons/io5";
import { TbCopyCheckFilled } from "react-icons/tb";
import {toast} from 'react-toastify';
import { useSharedData } from '../../hooks/useSharedData';

const CopyToClipboard = () => {
    const {roomid:textToCopy} = useSharedData();
    const [copy,setCopy] = useState(false);
    const handleCopy = async () => {
        try{
            const url = `${window.location.origin}/editor/${textToCopy}`;
            await navigator.clipboard.writeText(url);
            toast.success("URL Copied !");
            setCopy(true);
            setTimeout(()=>{
                setCopy(false);
                
            },1500);
        }
        catch(err){
            console.error('Failed to Copy !',err);
        }
        
    }
  return (
    <div onClick={handleCopy} className='pl-2 pr-1'>
        { !copy ?
            <IoCopy className='h-5 w-5 dark:text-white text-black'/>
            :
            <TbCopyCheckFilled className='h-6 w-6 dark:text-white text-black'/>
         
        }
        
    </div>
    
  )
}

export default CopyToClipboard