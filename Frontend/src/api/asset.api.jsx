import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { baseApi } from "./base.api";
import { assetEndPoints } from "./endpoints";
import { setAssetsList } from "../features/asset.slice";
import { useSelector } from "react-redux";
import { setFacultyList } from "../features/faculty.slice";

// custome hook to get all assets from backend
export const useGetAllAsset = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    // function to get assets
    const getAssets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.get(assetEndPoints.asset);
            if (response) {
                const assetsList = response.data.assetList;
                dispatch(setAssetsList(assetsList));
                toast.success("Assets fetched successfully");
                return assetsList;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Asset Fetching failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, getAssets }
}
// custome hook to add asset to db
export const useAddAsset = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const assetsList = useSelector(state => state.assets.assetsList);
    const addAsset = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.post(assetEndPoints.asset, formData);
            if (response?.data) {
                const newAsset = response.data.newAsset;
                const updatedAssetsList = [...assetsList, newAsset];
                dispatch(setAssetsList(updatedAssetsList));
                toast.success("Asset added successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Add Asset failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { addAsset, loading, error }
}
// custome hook to transfer asset -- update/edit
export const useTransferAsset = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const assetsList = useSelector(state => state.assets.assetsList);
    const {getAssets} = useGetAllAsset();

    const transferAsset = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.patch(assetEndPoints.asset, formData);
           console.log("response from transfer asset api", response);
            if (response?.data) {
                await getAssets(); // Refresh the assets list after transfer    
                toast.success("Asset transferred successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Transfer Asset failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { transferAsset, loading, error }
}

// ======================= faculty api calls =========================
// custome hook to get faculty from backend
export const useGetAllFaculty = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    // function to get assets
    const getFaculty = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.get(assetEndPoints.faculty);
            if (response) {
                const facultyList = response.data.facultyList;
                dispatch(setFacultyList(facultyList));
                toast.success("Faculty fetched successfully");
                return facultyList;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Faculty Fetching failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, getFaculty }
}
// custome hook to add faculty to db
export const useAddFaculty = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const facultyList = useSelector(state => state.faculty.facultyList);
    const addFaculty = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseApi.post(assetEndPoints.faculty, formData);
            if (response?.data) {
                const newFaculty = response.data.user;
                const updatedFacultyList = [...facultyList, newFaculty];
                dispatch(setFacultyList(updatedFacultyList));
                toast.success("Faculty added successfully");
                return response.data;
            }
        } catch (error) {
            console.log("error ", error);
            const message = error?.response?.data?.message || error?.message || "Add Faculty failed";
            setError(message);
            toast.error(message);
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    return { addFaculty, loading, error }
}

// custome hook to delete faculty from backend
export const useDeleteFaculty = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const facultyList = useSelector(state => state.faculty.facultyList);

    // function to delete faculty
    const deleteFaculty = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.delete(assetEndPoints.deleteFaculty(id));
            console.log("deleted response ", response);

            if (response.data) {
                let updatedList = facultyList.filter(faculty => faculty._id !== id);
                toast.success("Faculty Deleted Successfully.");
                dispatch(setFacultyList(updatedList));
                return updatedList;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Faculty Deletion failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, deleteFaculty }
}

