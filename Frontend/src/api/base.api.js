import axios from "axios";

 export const baseApi=axios.create({
    baseURL: "http://localhost:5000/api",
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