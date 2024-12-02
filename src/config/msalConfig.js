import { PublicClientApplication } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_MSAL_ID
const redirectUri = import.meta.env.VITE_APP_URL
const tenant_ID = import.meta.env.VITE_TENANT_ID

/**
 * MSAL configuration for authenticating with Microsoft Identity Platform.
 * Sets up the client ID, authority, and redirect URI for the application.
 * 
 * @constant {Object} msalConfig
 * @property {Object} auth - The authentication configuration.
 * @property {string} auth.clientId - The client ID for the MSAL application, loaded from environment variables.
 * @property {string} auth.authority - The authority URL for the Microsoft login, pointing to a specific tenant.
 * @property {string} auth.redirectUri - The URI where the application will redirect after authentication, loaded from environment variables.
 * @property {Object} cache - The caching configuration.
 * @property {string} cache.cacheLocation - Specifies where to store cache; "localStorage" for persisting cache across sessions.
 * @property {boolean} cache.storeAuthStateInCookie - Determines if the auth state should be stored in cookies (useful for IE11 compatibility).
 */
const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenant_ID}`,
        redirectUri: redirectUri, 
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: false, 
    }
}

/**
 * Instance of PublicClientApplication created using MSAL configuration.
 * Used to manage authentication with Microsoft Identity Platform.
 * 
 * @constant {PublicClientApplication} msalInstance
 */
export const msalInstance = new PublicClientApplication(msalConfig)
