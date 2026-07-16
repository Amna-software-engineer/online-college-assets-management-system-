import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const baseApi=axios.create({
    baseURL: isLocalhost ? "http://localhost:5000/api" : "https://online-college-assets-management-sy.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    }
})
baseApi.interceptors.request.use(
    (request)=>{
        const token=localStorage.getItem("token");
        if(token){
            request.headers["Authorization"]=`Bearer ${token}`;
        }
        return request;
    },
    (error)=>{
        return Promise.reject(error);
    }
)