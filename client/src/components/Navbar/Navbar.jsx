
import { JoinButton } from './JoinButton'
import Overlay from '../Popup/Overlay';
import { Popup } from '../Popup/Popup';
import {  Link } from 'react-router-dom';
import { signOutUser } from '../Auth/service/firebaseApi';
import CopyToClipboard from './CopyToClipboard';
import { toast } from 'react-toastify';
import { useSharedData } from '../../hooks/useSharedData';
import socket from '../../socket';



const Navbar =  () => {
    const {roomid,IsClicked,username,setUserName,isAuth,setIsAuth,setRoomId} = useSharedData();
    
    
    const handleLogout = async () => {
        try{
            await signOutUser();
            setUserName(null);
            setIsAuth(false);
            setRoomId(null);
            socket.emit('leave-room');
            toast.info("Logged out Successfully");
            console.log("user Signed out successfully");
        }catch(err){
            console.log(err);
        }
        
    }

  return (
    <div className='h-full'>
        {IsClicked && 
            <Overlay>
            <Popup /> 
            </Overlay>  
        }
        <div className='h-full grid grid-cols-2 grid-rows-1 gap-4'>
            <div className='col-start-1 p-2 flex-col items-center justify-start'>
            <h1 className="p-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500">Code</span> 
            </h1>
            {username && <h2 className='px-2 text-white font-mono text-xl'>Hi <span className='text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500'>{username}</span> Welcome to SynCode!</h2>}
            </div>
            
            <div className='col-start-2 p-2 flex justify-end items-center'>
                <div className='pt-2'>
                    <JoinButton  />
                    
                    { !isAuth ? 
                        <Link to='/login'><button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Login 
                        </span>
                        </button></Link>
                    :
                        <Link to='/'><button onClick={handleLogout} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Logout 
                        </span>
                        </button></Link>
                    }
                </div>
                <div className=''>
                    {roomid &&
                        <div className='flex items-center'>
                            <p className='dark:text-white text-xs sm:text-sm md:text-md lg:text-lg '>{`ID : ${roomid}`}</p> 
                            <div>
                                <CopyToClipboard />
                            </div>
                        </div> 
                    }
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Navbar