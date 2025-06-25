import axios from "axios"


const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

axios.defaults.baseURL=`https://identitytoolkit.googleapis.com/v1`

export const registerApi = async (inputs)=>{
    const data = {
        displayName:inputs.name,
        email:inputs.email,
        password:inputs.password
    };

    return await axios.post(`/accounts:signUp?key=${API_KEY}`,data);
}


