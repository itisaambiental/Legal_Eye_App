import { PublicClientApplication } from '@azure/msal-browser';
const clientId = import.meta.env.VITE_MSAL_ID;
const redirectUri  = import.meta.env.VITE_APP_URL; 

const msalConfig = {
    auth: {
        clientId: clientId,
        authority: "https://login.microsoftonline.com/01708f05-25e1-4d84-a5f4-86558a6b8b0e", 
        redirectUri: redirectUri, 
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: false, 
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);
