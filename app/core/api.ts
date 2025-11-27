import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Generic POST function for API requests
export const post = async <T>(
  url: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.post<T>(url, data, config);
};

// Generic PUT function for API requests
export const put = async <T>(
  url: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.put<T>(url, data, config);
};

// Generic DELETE function for API requests
export const remove = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.delete<T>(url, config);
};

// Generic GET function for API requests
export const get = async <T>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.get<T>(url, { params, ...config });
};
