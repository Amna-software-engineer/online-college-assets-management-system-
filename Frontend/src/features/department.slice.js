import { createSlice } from "@reduxjs/toolkit";

const savedDept = JSON.parse(localStorage.getItem("deptList"));

const deptSlice = createSlice({
    name: 'department',
    initialState: {deptList:  savedDept && savedDept !== "undefined" ? savedDept : []},
    reducers: {
        setDeptList: (state, action) => {
            state.deptList = action.payload;
            localStorage.setItem("deptList", JSON.stringify(action.payload));
        },
     
    }
})

export const {setDeptList} = deptSlice.actions;
export default deptSlice.reducer;