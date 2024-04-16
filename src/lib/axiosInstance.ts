import axios from 'axios';

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses globally
    if (error.response && error.response.status === 401) {
      // Unauthorized access, redirect to login or handle session expiration
      console.error('Authorization failed, please login again.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
