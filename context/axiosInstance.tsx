import axios, { AxiosInstance } from 'axios';


// Define a type for your token
type Token = string | undefined;

// Create an Axios instance with custom configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
    (config) => {

        let user : IUser | null = null;

        if (window){
            const userString = window.localStorage.getItem("user")

            if(userString){
                user = JSON.parse(userString)
            }
        }

        const token: Token = user ? user.token : undefined
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