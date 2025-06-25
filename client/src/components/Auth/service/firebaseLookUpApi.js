
import axios from "axios";
import { getUserData } from "./storage";

const API_KEY = 'AIzaSyCwA9pl2HuTtMduFSKo2TOGw0nXzAL4Ebo';
axios.defaults.baseURL = `https://identitytoolkit.googleapis.com/v1`

export const getUserDetailApi = async () => {
    const data = {idToken:getUserData()};
    return await axios.post(`/accounts:lookup?key=${API_KEY}`,data);
}