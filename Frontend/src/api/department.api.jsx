import { useState } from "react";
import { setDeptList } from "../features/department.slice";
import { useDispatch } from "react-redux";
import { deptEndPoints } from "./endpoints";
import { toast } from "react-toastify";
import { baseApi } from "./base.api";

// custome hook to get all dept from backend
export const useGetAllDept = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    // function to get dept
    const getDepts = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("useGetAllDept");
            
            const response = await baseApi.get(deptEndPoints.request);
            if (response) {
                const deptList = response.data.deptList;
               dispatch(setDeptList(deptList));
               toast.success("Departments fetched successfully");
                return deptList;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Department Fetching failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, getDepts }
}