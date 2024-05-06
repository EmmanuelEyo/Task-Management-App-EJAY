"use client"
import { createContext, useState, useEffect, useContext } from "react";
import { account } from '../appwriteConfig'
import { useRouter } from 'next/navigation'
import { ID } from "appwrite";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(() => {
        getUserOnLoad()
    }, [])

    const getUserOnLoad = async () => {
        try{
            const userAccountDetails = await account.get();
            setUser(userAccountDetails)
        }catch(err) {
            console.info('error:', err)
        }
        setIsLoading(false)
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault()
        try{
            const response = await account.createEmailPasswordSession(
                credentials.email,
                credentials.password,
            );
            console.log("LOGGEDIN:", response)
            const userAccountDetails = await account.get();
            console.log('USERDETAILS:', userAccountDetails)
            setUser(userAccountDetails)
            router.replace('/')
        }catch(err) {
            console.error("Error:", err)
        }
    }

    const handleUserLogout = async () => {
        await account.deleteSession('current')
        setUser(null)
    }

    const handleUserRegister = async (e, credentials) => {
        e.preventDefault()
        if (credentials.password1 !== credentials.password2) {
            alert('Password do not match! Please confirm and try again')
            return
        }
        try{
            let response = await account.create(
                ID.unique(),
                credentials.email,
                credentials.password1,
                credentials.name,
            )
            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password1,
            );
            const userAccountDetails = await account.get();
            console.log('USERDETAILS:', userAccountDetails)
            setUser(userAccountDetails)
            router.replace('/')

            console.log('REGISTERED:', response)
        } catch(err) {
            console.error(err)
        }
    }

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
        handleUserRegister,
    }
    return <AuthContext.Provider value={contextData}>
        {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
}

export const useAuth = () => {return useContext(AuthContext)}

export default AuthContext