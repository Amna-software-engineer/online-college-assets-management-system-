import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
            //    toast.success("Requests fetched successfully");
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

// custome hook to request asset to db
export const useRequestAsset = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const requestList = useSelector(state => state.assets.requestList);
    const {getRequests}=useGetAllRequest();
    const requestAsset = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.post(requestEndPoints.request, formData);
            if (response?.data) {
              await getRequests();
                toast.success("Request submited successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Request submission failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { requestAsset, loading, error }
}
// custome hook to update asset to db
export const useUpdateRequest = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const requestList = useSelector(state => state.assets.requestList);
    const {getRequests}=useGetAllRequest();
    const updateRequest = async (formData,id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.patch(requestEndPoints.updateRequest(id), formData);
            if (response?.data) {
              await getRequests();
                toast.success("Request updated successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Request update failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { updateRequest, loading, error }
}
// custome hook to delete request from backend
export const useDeleteRequest = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const requestList = useSelector(state => state.assets.requestList);
    const { getRequests } = useGetAllRequest(); // to refresh request list after deletion

    // function to delete request
    const deleteRequest = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.delete(requestEndPoints.deleteRequest(id));
            console.log("deleted response ", response);

            if (response.data) {
                toast.success("Request Deleted Successfully.")
                await getRequests(); // refresh request list
                return response.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Request Deletion failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, deleteRequest }
}