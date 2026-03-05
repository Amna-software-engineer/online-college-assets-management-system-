import { createSlice } from "@reduxjs/toolkit";

const savedAssets = JSON.parse(localStorage.getItem("assetsList"));

const assetSlice = createSlice({
    name: 'asset',
    initialState: {assetsList:  savedAssets && savedAssets !== "undefined" ? savedAssets : []},
    reducers: {
        setAssetsList: (state, action) => {
            state.assetsList = action.payload;
            localStorage.setItem("assetsList", JSON.stringify(action.payload));
        },
     
    }
})

export const {setAssetsList} = assetSlice.actions;
export default assetSlice.reducer;