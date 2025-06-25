import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const saveCode = async ({roomid,code,language}) =>{
    await fetch(`${BASE_URL}/code/save`,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({roomid,code,language})
    });
};

export const getCode = async (roomid) => {
    const res = await fetch(`${BASE_URL}/code/${roomid}`);
    const data = await res.json();
    return data;
};


export const runCode = async ({code,language,input}) =>{
    
    try{
        const res = await axios.post(`${BASE_URL}/run`,{
            code,
            language,
            input
        });
        return res.data;
    }catch(error){
        return `Error Running Code : ${error}`
    }
}