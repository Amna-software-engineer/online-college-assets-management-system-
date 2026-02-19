import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("currUser"));

const authSlice = createSlice({
    name: 'auth',
    initialState: {currUser:  savedUser && savedUser !== "undefined" ? savedUser : []},
    reducers: {
        setUser: (state, action) => {
            console.log(action.payload);
            
            state.currUser = action.payload;
            localStorage.setItem("currUser", JSON.stringify(action.payload));
        },
     
    }
})

export const {setUser} = authSlice.actions;
export default authSlice.reducer;