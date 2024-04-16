import { Method, AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

function extractErrorMessage(data: any): string {
  if (!data) return 'An error occurred';

  if (Array.isArray(data) && data.length > 0) {
    // If it's an array, try to pull messages from first item
    return data[0].message || 'An error occurred';
  }

  if (data && typeof data === 'object') {
    return data;
  }

  return JSON.stringify(data);
}

export async function fetchApi(
  method: Method,
  url: string,
  data?: any,
  token?: string,
  params?: any,
) {
  const config: AxiosRequestConfig = {
    method: method,
    url: url,
    params: method === 'GET' ? params : undefined,
    data: method !== 'GET' ? data : undefined,
    headers: {},
  };

  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }

  try {
    const response = await axiosInstance(config);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // console.log(axiosError.response, 'ERR AXIOS');
      return {
        success: false,
        message: extractErrorMessage(axiosError.response.data),
        status: axiosError.response.status,
        data: null,
      };
    }
    return {
      success: false,
      message: axiosError.message || 'Network error',
      status: axiosError.status || 500,
      data: null,
    };
  }
}
