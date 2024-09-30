import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "a1739412-13c0-4678-af70-759ea45586e3",
        authority: "https://login.microsoftonline.com/01708f05-25e1-4d84-a5f4-86558a6b8b0e", 
        redirectUri: "http://localhost:5173", 
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: false, 
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);
