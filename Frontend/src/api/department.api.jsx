import { useState } from "react";
import { setDeptList } from "../features/department.slice";
import { useDispatch } from "react-redux";
import { deptEndPoints  } from "./endpoints";
import { toast } from "react-toastify";
import { baseApi } from "./base.api";
import { useGetAllFaculty } from "./asset.api";

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

            const response = await baseApi.get(deptEndPoints.department);
            if (response) {
                const deptList = response.data.deptList;
                dispatch(setDeptList(deptList));
                // toast.success("Departments fetched successfully");
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
// custome hook to create dept
export const useCreatelDept = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getDepts } = useGetAllDept();
    const dispatch = useDispatch();
    // function to create dept
    const createDept = async (name) => {
        setLoading(true);
        setError(null);
        try {
            const response = await baseApi.post(deptEndPoints.department, name);
            if (response.data) {
                await getDepts();
                toast.success("Departments fetched successfully");
                return response.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Department Creation failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, createDept }
}
// custome hook to update dept /assign hod to dept
export const useUpdateDept = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getDepts } = useGetAllDept();
    const { getFaculty } = useGetAllFaculty();
    const dispatch = useDispatch();
    // function to update dept
    const updateDept = async (deptId, hodId) => {
        setLoading(true);
        setError(null);
        try {
            console.log(deptId, hodId);

            const response = await baseApi.patch(deptEndPoints.updateDept(deptId), { hodId });
            if (response.data) {
              await  Promise.all([
                     getDepts(),  getFaculty()
                ])

                toast.success("Departments Updated successfully");
                return response.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Department Updation failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, updateDept }
}

// 
export const useRequestAudit = () => {
    const [loading, setLoading] = useState(false);
    const { getDepts } = useGetAllDept();

    const requestAudit = async (deptId) => {

        setLoading(true);
        try {
            // Backend endpoint: /api/department/request-audit/:deptId
            const response = await baseApi.patch(deptEndPoints.requestAudit(deptId));
            
            if (response.data) {
                // Store refresh so on "Audit Pending" Show
                await getDepts(); 
                toast.success("Audit request sent to HOD");
                return response.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to request audit";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, requestAudit };
};
export const useVerifyAudit = () => {
    const [loading, setLoading] = useState(false);

    const verifyAudit = async (deptId,totalItems) => {
        if (!deptId) {
            toast.error("Department ID is missing");
            return;
        }

        setLoading(true);
        try {
            const response = await baseApi.patch(deptEndPoints.verifyAudit(deptId),{totalItems});
            
            if (response.data) {
                toast.success("Audit verification completed successfully");
                return response.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to verify audit";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, verifyAudit };
};