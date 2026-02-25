import { useState } from "react"
import { setUser } from "../features/auth.slice"
import { authEndPoints } from "./endpoints"
import { baseApi } from "./base.api"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux";

export const UseLogin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const login = async (email, password) => {
        console.log("email, password ", email, password);
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.post(authEndPoints.login, { email, password })
            // Store the token and user data in local storage
            console.log("response ", response);

            if (response.data) {
                localStorage.setItem("token", response.data.token);
                dispatch(setUser(response.data.user));
                toast.success("Logged in successfully.");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Login failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { login, loading, error }
}


// eslint-disable-next-line react-refresh/only-export-components
export const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const register = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.post(authEndPoints.register,  formData );
            if (response?.data) {
                toast.success("Registered successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Register failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }

    }

    return {register,loading,error}
}