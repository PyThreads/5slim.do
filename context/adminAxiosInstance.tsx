import axios, { AxiosInstance } from 'axios';


// Define a type for your token
type Token = string | undefined;

// Create an Axios instance with custom configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
    (config) => {

        let token : string | undefined | null = "";

        if (window){
            token = localStorage.getItem("TKN-5SL-M0");
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;