import axios from 'axios';


const BASE_URL_TESTING = 'http://localhost:5000/api/get-agora-token';
const BASE_URL_PROD = 'https://syncode-7364.onrender.com/api/get-agora-token';


export const getAgoraToken = async (channelName,uid) => {
  try{
    const res = await axios.get(`${BASE_URL_PROD}?channel=${channelName}&uid=${uid}`);
    // console.log(res.data);
    return res.data;
  }
  catch(err){
    console.log("error while fetching token",err.message);
  }
    
}