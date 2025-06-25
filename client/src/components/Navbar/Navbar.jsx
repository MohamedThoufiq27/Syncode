
import { JoinButton } from './JoinButton'
import Overlay from '../Popup/Overlay';
import { Popup } from '../Popup/Popup';
import {  Link } from 'react-router-dom';
import { isAuth } from '../Auth/service/auth';
import { useEffect, useState } from 'react';
import { getUserDetailApi } from '../Auth/service/firebaseLookUpApi';
import { signOutUser } from '../Auth/service/firebaseConfig';

const Navbar = ({roomid,setRoomId,IsClicked,setIsClicked}) => {
    const [user,setUser]=useState({name:''});
    useEffect(()=>{
        if(!isAuth()){
            console.log('Not Authenticated')
            return ;
        }
        getUserDetailApi().then((res)=>{
            setUser({name:res.data.users[0].displayName});
        }).catch((err)=>{
            console.log(err);
        })
        console.log(user.name);
    },[])

    const handleLogout = async () => {
        localStorage.removeItem('idToken');
        try{
            await signOutUser();
            console.log("user Signed out successfully");
        }catch(err){
            console.log(err);
        }
        setUser({name:''});

    }

  return (
    <div className='h-full'>
        {IsClicked && 
            <Overlay>
            <Popup setIsClicked={setIsClicked} setRoomId={setRoomId} /> 
            </Overlay>  
        }
        <div className='h-full grid grid-cols-2 grid-rows-1 gap-4'>
            <div className='col-start-1 p-2 flex-col items-center justify-start'>
            <h1 className="p-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500">Code</span> 
            </h1>
            {user.name && <h2 className='px-2 text-white font-mono text-xl'>Hi <span className='text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500'>{user.name}</span> Welcome to SynCode!</h2>}
            </div>
            
            <div className='col-start-2 p-2 flex justify-end items-center'>
                <div className='pt-2'>
                    <JoinButton   setIsClicked={setIsClicked} />
                    
                    {!isAuth() ? 
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
                <div className=''>{roomid ? <p className='dark:text-white text-xs sm:text-sm md:text-md lg:text-lg '>{`ID : ${roomid}`}</p> : <span></span>}</div>
                
            </div>
        </div>
    </div>
  )
}

export default Navbar