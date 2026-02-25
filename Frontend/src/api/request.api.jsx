import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRequestList } from "../features/request.slice";
import { requestEndPoints } from "./endpoints";
import { toast } from "react-toastify";
import { baseApi } from "./base.api";

// custome hook to get all assets from backend
export const useGetAllRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    // function to get assets
    const getRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.get(requestEndPoints.request);
            if (response) {
                const requestList = response.data.requestList;
               dispatch(setRequestList(requestList));
               toast.success("Requests fetched successfully");
                return requestList;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Request Fetching failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, getRequests }
}