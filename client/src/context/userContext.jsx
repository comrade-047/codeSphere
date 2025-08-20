/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchUserOnLoad = async() => {
            const token = localStorage.getItem('token');
            if(token){
                try{                    
                    const res = await axiosInstance.get(API_PATHS.AUTH.GET_ME);
                    setUser(res.data);
                }
                catch(err){
                    console.error("Failed to fetch user on load : ",err);
                    clearUser();
                }
            }
            setLoading(false);
        }
        fetchUserOnLoad();
    },[]);

    const updateUser = (userData) => {
        setUser(userData);
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    }

    return(
        <UserContext.Provider value={{user, updateUser, clearUser, loading}} >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;