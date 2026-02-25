import { createSlice } from "@reduxjs/toolkit";

const savedRequests = JSON.parse(localStorage.getItem("requestList"));

const assetSlice = createSlice({
    name: 'request',
    initialState: {requestList:  savedRequests && savedRequests !== "undefined" ? savedRequests : []},
    reducers: {
        setRequestList: (state, action) => {
            console.log(action.payload);   
            state.requestList = action.payload;
            localStorage.setItem("requestList", JSON.stringify(action.payload));
        },
     
    }
})

export const {setRequestList} = assetSlice.actions;
export default assetSlice.reducer;