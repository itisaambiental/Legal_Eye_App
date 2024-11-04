/* eslint-disable react/prop-types */
import { useState, useEffect, createContext, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { msalInstance } from '../utils/msalConfig'

/**
 * User authentication and role management context.
 * Provides user authentication status, role flags, and functions to update the user's context and handle logout.
 * 
 * @module UserContext
 */

const Context = createContext({})

/**
 * UserContextProvider component.
 * Wraps child components with user authentication and role context.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that will have access to user context.
 * 
 * @returns {JSX.Element} Context provider for user authentication and role-based access.
 */
export function UserContextProvider({ children }) {
    const [jwt, setJWT] = useState(() => window.localStorage.getItem('jwt'))
    const [isAdmin, setIsAdmin] = useState(false)
    const [isAnalyst, setIsAnalyst] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    /**
     * Sets role flags based on user type.
     * @param {number} userType - The user type, where 1 represents admin and 2 represents analyst.
     */
    const setRoleFlags = (userType) => {
        setIsAdmin(userType === 1)
        setIsAnalyst(userType === 2)
    }

    /**
     * Updates the JWT and role context.
     * If a token is provided, sets it in local storage and updates the JWT state.
     * If null, clears the JWT from both state and local storage, and resets role flags.
     * 
     * @function
     * @param {string|null} token - JWT token or null to reset context.
     */
    const updateUserContext = useCallback((token) => {
        if (token) {
            setJWT(token)
            window.localStorage.setItem('jwt', token)
        } else {
            setJWT(null)
            window.localStorage.removeItem('jwt')
            setIsAdmin(false)
            setIsAnalyst(false)
        }
    }, [])

    /**
     * Logs out the user by clearing the JWT and role context.
     * Also clears the MSAL cache to reset authentication status.
     */
    const logout = useCallback(() => {
        updateUserContext(null)
        msalInstance.clearCache()
    }, [updateUserContext])

    /**
     * Effect that decodes the JWT to set role flags if a token exists.
     * If decoding fails, logs out the user to clear invalid token data.
     */
    useEffect(() => {
        if (jwt) {
            try {
                const decodedToken = jwtDecode(jwt)
                setRoleFlags(decodedToken.userForToken.userType)
            } catch (error) {
                console.error("Error decoding token:", error)
                logout()
            }
        }
        setIsLoading(false)
    }, [jwt, logout])

    return (
        <Context.Provider value={{ jwt, isAdmin, isAnalyst, isLoading, updateUserContext, logout }}>
            {children}
        </Context.Provider>
    )
}

export default Context
