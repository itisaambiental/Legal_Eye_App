/* eslint-disable react/prop-types */
import { useState, useEffect, createContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const Context = createContext({});

export function UserContextProvider({ children }) {
    const [jwt, setJWT] = useState(() => window.localStorage.getItem('jwt'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAnalyst, setIsAnalyst] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    const setRoleFlags = (userType) => {
        setIsAdmin(userType === 1);
        setIsAnalyst(userType === 2);
    };

    const updateUserContext = useCallback((token) => {
        if (token) {
            setJWT(token);
            window.localStorage.setItem('jwt', token);
        } else {
            setJWT(null);
            window.localStorage.removeItem('jwt');
            setIsAdmin(false);
            setIsAnalyst(false);
        }
    }, []);

    const logout = useCallback(() => {
        updateUserContext(null);
    }, [updateUserContext]);

    useEffect(() => {
        if (jwt) {
            try {
                const decodedToken = jwtDecode(jwt);
                setRoleFlags(decodedToken.userForToken.userType);
            } catch (error) {
                console.error("Error decoding token:", error);
                logout();
            }
        }
        setIsLoading(false); 
    }, [jwt, logout]);

    return (
        <Context.Provider value={{ jwt, isAdmin, isAnalyst, isLoading, updateUserContext, logout }}>
            {children}
        </Context.Provider>
    );
}

export default Context;
