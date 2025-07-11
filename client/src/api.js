import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const saveCode = async ({roomid,language,tree}) =>{
    await fetch(`${BASE_URL}/code/save`,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({roomid,language,tree})
    });
};

export const getCode = async (roomid) => {
    const res = await fetch(`${BASE_URL}/code/${roomid}`);
    const data = await res.json();
    return data;
};


export const runCode = async ({code,language,input}) =>{
    console.log(language);
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

export const askAi = async ({prompt}) => {
    try{
        const res = await axios.post(`${BASE_URL}/copilot`,{prompt});
        console.log(res.data.output);
        return res.data.output;
    }catch(err){
        return `Error while Generating Code : ${err}`
    }
}