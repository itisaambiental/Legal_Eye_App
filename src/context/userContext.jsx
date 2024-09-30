import { useState, createContext } from 'react';
import { jwtDecode } from "jwt-decode";

const Context = createContext({});

export function UserContextProvider({ children }) {
    const [jwt, setJWT] = useState(() => window.localStorage.getItem('jwt'));
  
    const [isAdmin, setIsAdmin] = useState(() => {
      const decodedToken = jwt && jwt !== "" && jwt !== "null" ? jwtDecode(jwt) : null;
      return decodedToken && decodedToken.userForToken.userType === 1;
    });
  
    const [isAnalyst, setIsAnalyst] = useState(() => {
      const decodedToken = jwt && jwt !== "" && jwt !== "null" ? jwtDecode(jwt) : null;
      return decodedToken && decodedToken.userForToken.userType === 2; 
    });
  
    return (
      <Context.Provider value={{ jwt, setJWT, isAdmin, isAnalyst, setIsAdmin, setIsAnalyst }}>
        {children}
      </Context.Provider>
    );
  }


export default Context;
