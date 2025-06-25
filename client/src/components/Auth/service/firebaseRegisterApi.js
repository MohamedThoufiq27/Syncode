import axios from "axios"


const API_KEY = 'AIzaSyCwA9pl2HuTtMduFSKo2TOGw0nXzAL4Ebo';

axios.defaults.baseURL=`https://identitytoolkit.googleapis.com/v1`

export const registerApi = async (inputs)=>{
    const data = {
        displayName:inputs.name,
        email:inputs.email,
        password:inputs.password
    };

    return await axios.post(`/accounts:signUp?key=${API_KEY}`,data);
}


