import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom';
import EditorPage from './components/EditorPage/EditorPage';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { useEffect, useState } from 'react';
import { getRoomId } from './components/Navbar/storeRoomId';
import PasswordReset from './components/Auth/PasswordReset';




const App = () => {
  const [roomid,setRoomId]= useState(null);
  const [IsClicked,setIsClicked]= useState(false);
  

  
  
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
          <Route path='/register' element={<Register roomid={roomid}/>}  />
          <Route path='/login' element={<Login roomid={roomid}/> } />
          <Route path='/resetpassword' element={<PasswordReset />} />
          <Route path='/' element={
            <Home
                roomid={roomid} 
                setRoomId={setRoomId} 
                IsClicked={IsClicked} 
                setIsClicked={setIsClicked} 
                
              />} 
            />
          <Route path='/editor/:roomid' element={
            <EditorPage 
                roomid={roomid} 
                setRoomId={setRoomId} 
                IsClicked={IsClicked} 
                setIsClicked={setIsClicked} 
                  />} />
        </Routes>
        
      </BrowserRouter>
      
    </div>
  )
}

export default App