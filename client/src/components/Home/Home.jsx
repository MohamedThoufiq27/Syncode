
import { Navigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { useSharedData } from '../../hooks/useSharedData'




const Home = () => {
  const {roomid,IsClicked,isAuth} = useSharedData();

  return (
    <div className={`grid grid-cols-5 grid-rows-5 gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 dark:bg-gray-900 bg-white w-screen h-screen ${IsClicked && 'backdrop-blur-3xl'}`}>
        <div className='col-span-5'>
          <Navbar  />
        </div>
        {roomid && isAuth ? 
          <Navigate to={`/editor/${roomid}`} />
        :
        <h1 className='col-span-5 row-span-4 row-start-2 mt-40 dark:text-white text-zinc-950 text-center text-2xl'>Please enter a room ID to start editing.</h1> 
          }
    </div>
  )
}

export default Home