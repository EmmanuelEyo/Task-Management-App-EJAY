import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    const router = useRouter()      

    if(!user) {
        router.replace('/login')
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute