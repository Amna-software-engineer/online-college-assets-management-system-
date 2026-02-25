import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice";
import assetReducer from "./features/asset.slice";
import requestReducer from "./features/request.slice";
import facultyReducer from "./features/faculty.slice";

export const store = configureStore({
    reducer: { 
        auth: authReducer, 
        assets: assetReducer,
        requests: requestReducer,
        faculty: facultyReducer
    }
})