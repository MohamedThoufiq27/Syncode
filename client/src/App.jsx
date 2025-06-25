import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom';
import EditorPage from './components/EditorPage/EditorPage';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { useEffect, useState } from 'react';
import { getRoomId } from './components/Navbar/storeRoomId';



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
          <Route path='/register' element={<Register/>}  />
          <Route path='/login' element={<Login /> } />
          <Route path='/' element={<Home roomid={roomid} setRoomId={setRoomId} IsClicked={IsClicked} setIsClicked={setIsClicked} />} />
          <Route path='/editor' element={<EditorPage roomid={roomid} setRoomId={setRoomId} IsClicked={IsClicked} setIsClicked={setIsClicked} />} />
        </Routes>
        
      </BrowserRouter>
      
    </div>
  )
}

export default App