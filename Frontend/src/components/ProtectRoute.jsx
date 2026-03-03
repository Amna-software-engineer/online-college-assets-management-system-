import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Loader  from './Loader'

export const ProtectRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null)
    const token = localStorage.getItem('token')
    console.log(token);
    
    const varifyToken = () => {
        if (!token) {
            console.log("token doesnot exist");
            
            setIsValid(false) // token doesnot exist
            return
        }
        const decoded = jwtDecode(token)
        console.log("decoded ",decoded);
        
        // token valid
        if (decoded.role === "HOD") {
            console.log("decoded.role ",decoded.role);
            
            setIsValid(true)
        } else if (decoded.role === "Principal") {
            setIsValid(true)
        } else {
             console.log("token exist but role is not valid ",decoded.role);
            setIsValid(null) // token exist but role is not valid
        }
    }

    useEffect(() => {
        varifyToken()
    }, [token])

    if (isValid === null) { return <Loader /> }
    return isValid ? children : <Navigate to='/login' />
}