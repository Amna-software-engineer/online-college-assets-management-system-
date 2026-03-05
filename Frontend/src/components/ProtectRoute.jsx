import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Loader  from './Loader'

export const ProtectRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null)
    const token = localStorage.getItem('token')
    
    const varifyToken = () => {
        if (!token) {        
            setIsValid(false) // token doesnot exist
            return
        }
        const decoded = jwtDecode(token)
        
        // token valid
        if (decoded.role === "HOD") {      
            setIsValid(true)
        } else if (decoded.role === "Principal") {
            setIsValid(true)
        } else {
            setIsValid(null) // token exist but role is not valid
        }
    }

    useEffect(() => {
        varifyToken()
    }, [token])

    if (isValid === null) { return <Loader /> }
    return isValid ? children : <Navigate to='/login' />
}