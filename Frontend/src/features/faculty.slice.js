import { createSlice } from "@reduxjs/toolkit";

const savedFaculty = JSON.parse(localStorage.getItem("facultyList"));

const facultySlice = createSlice({
    name: 'faculty',
    initialState: {facultyList:  savedFaculty && savedFaculty !== "undefined" ? savedFaculty : []},
    reducers: {
        setFacultyList: (state, action) => {
            console.log(action.payload);   
            state.facultyList = action.payload;
            localStorage.setItem("facultyList", JSON.stringify(action.payload));
        },
     
    }
})

export const {setFacultyList} = facultySlice.actions;
export default facultySlice.reducer;