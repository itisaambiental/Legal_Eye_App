import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

const server = axios.create({
  baseURL: serverUrl, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default server;
