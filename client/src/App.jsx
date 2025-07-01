import {BrowserRouter,Routes,Route} from 'react-router-dom';
import EditorPage from './components/EditorPage/EditorPage';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { useEffect } from 'react';
import { getRoomId } from './components/Navbar/storeRoomId';
import PasswordReset from './components/Auth/PasswordReset';
import { Bounce, ToastContainer } from 'react-toastify';
import GithubCorner from './components/GithubCorner';
import { useSharedData } from './hooks/useSharedData';





const App = () => {
  const {setRoomId} = useSharedData();
  
  useEffect(()=>{
    const id=getRoomId();
    if(id){
      setRoomId(id);
    }
  },[])

 return (
  
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />}  />
          <Route path='/login' element={<Login /> } />
          <Route path='/resetpassword' element={<PasswordReset />} />
          <Route path='/' element={<Home/>} />
          <Route path='/editor/:roomid' element={<EditorPage />} />
        </Routes>
        
      </BrowserRouter>
      <ToastContainer 
        position='top-center'
        autoClose={1000}
        hideProgressBar={true}
        theme='dark'
        transition={Bounce}
      />
      {/* <GithubCorner /> */}
    </div>
   
  )
}

export default App