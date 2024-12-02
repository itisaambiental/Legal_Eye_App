import axios from "axios"

const serverUrl = import.meta.env.VITE_API_URL

/**
 * Axios instance configured for the server API.
 * Uses a base URL from environment variables and sets default headers for JSON requests.
 * 
 * @constant {AxiosInstance}
 */
const server = axios.create({
  baseURL: serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default server
