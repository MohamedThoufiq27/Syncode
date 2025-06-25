import axios from "axios";

const API_KEY = 'AIzaSyCwA9pl2HuTtMduFSKo2TOGw0nXzAL4Ebo';
axios.defaults.baseURL = `https://identitytoolkit.googleapis.com/v1`

export const loginApi = async (inputs) => {
    const data = {email:inputs.email,password:inputs.password};
    return await axios.post(`/accounts:signInWithPassword?key=${API_KEY}`,data);
}