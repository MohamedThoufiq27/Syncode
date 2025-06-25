import { getUserData } from "./storage"

export const isAuth = () =>{
    return (getUserData()!=null)?true:false
}