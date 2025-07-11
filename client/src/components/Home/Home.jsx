import { Navigate,Link } from 'react-router-dom';
import { useState } from 'react';
import { useSharedData } from '../../hooks/useSharedData';
import teamworkAnimation from '../../assets/TeamWork.lottie'; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { storeRoomId } from '../Navbar/storeRoomId';


const Home = () => {
  const { roomid, isAuth, setRoomId ,username} = useSharedData();
  const [inputRoomId, setInputRoomId] = useState('');

  const handleSubmit = () => {
      if (inputRoomId.trim().length > 0) {
        setRoomId(inputRoomId.trim());
        storeRoomId(inputRoomId.trim());
      }
  };

  const handleJoin = () => {
    if(!isAuth){
          toast.warning("Please Login Before Join");
        }
        else handleSubmit();
  };

  const handleGenerateId = () => {
      const newuuid = uuidv4();
      console.log(newuuid);
      setInputRoomId(newuuid);
    }

  if (roomid && isAuth) return <Navigate to={`/editor/${roomid}`} />;

  return (
    <div className="min-h-screen w-full dark:bg-[#0f172a] bg-white text-white flex flex-col">
      {/* <Navbar /> */}
      {/* {IsClicked && 
            <Overlay>
            <Popup /> 
            </Overlay>  
        } */}

        
      <div className="flex flex-col-reverse lg:flex-row justify-around items-center flex-1 p-12 lg:p-6 gap-12">
        {/* Join Card */}
        <div className='flex flex-col justify-center'>
        <h1 className="w-full inline-flex justify-center mb-10 text-3xl font-semibold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
                Syn<span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500">Code</span> 
            </h1>
        {username && <h2 className='truncate px-2 text-white font-thin text-lg mb-5'>Hi <span className='truncate w-2 text-transparent bg-clip-text bg-gradient-to-r to-purple-500 from-pink-500'>{username}</span> Welcome to SynCode!</h2>}
        <div className="w-full max-w-md bg-gradient-to-tr from-purple-400 via-pink-500 to-purple-500 p-1 rounded-3xl shadow-xl">
          <div className="bg-[#0f172a] rounded-3xl px-8 py-10 backdrop-blur-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Join a <span className="text-purple-400">SynCode</span> Room
            </h1>
            <p className="text-gray-300 text-center mb-6">
              Enter a room ID and start collaborating instantly.
            </p>

            <input
              type="text"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />

            <button onClick={handleJoin} className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        join room 
                        </span>
                </button>
            {/* <JoinButton /> */}

            {!isAuth &&
            <Link to='/login'>
                <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  text-gray-900 rounded-lg group  bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Login 
                        </span>
                </button>
            </Link>
            }
          </div>
          <span onClick={handleGenerateId} className='text-md text-zinc-900 inline-flex justify-center w-full font-mono underline cursor-pointer'>Generate Random Id</span>
        </div>
        </div>

        
        <div className="w-full max-w-md flex justify-center">
          
          <DotLottieReact 
              src={teamworkAnimation}
              loop
              autoplay
              width={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
