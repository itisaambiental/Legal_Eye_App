import axios from "axios";

const API_KEY = import.meta.env.VITE_COPOMEX_API_KEY;

/**
 * Axios instance configured for the COPOMEX API.
 * This instance automatically appends the required token query parameter to all requests.
 * It uses a base URL and default headers, as well as a request interceptor to include the token.
 *
 * @constant {AxiosInstance} copomexAPI
 * @property {string} baseURL - The base URL for the COPOMEX API, set to "https://api.copomex.com/query".
 * @property {Object} headers - Default headers for requests, including 'Content-Type': 'application/json'.
 * @property {string} headers.Content-Type - Indicates that requests are sent as JSON.
 * @see {@link https://api.copomex.com/} - For more information on the COPOMEX API.
 */
const copomexAPI = axios.create({
  baseURL: "https://api.copomex.com/query",
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor that appends the API token as a query parameter to every request.
 * If params are missing, they will be initialized as an empty object before adding the token.
 */
copomexAPI.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.token = API_KEY;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default copomexAPI;
