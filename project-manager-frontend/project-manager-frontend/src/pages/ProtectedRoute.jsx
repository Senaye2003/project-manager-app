import {Navigate, OutLet } from "react-dom-router"
export function ProtectedRoute(){
    const token = localStorage.getItem("token")
    if (!token){
        return <Navigate to="/login" replace />
    }
    return(
     <OutLet />
    )
}