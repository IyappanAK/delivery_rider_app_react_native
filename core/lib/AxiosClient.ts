import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/config/app.config'
import { TOKEN_KEY } from '@/core/constants/index'



const axiosClient = axios.create()

axiosClient.defaults.baseURL = API_CONFIG.baseURL
axiosClient.defaults.timeout = API_CONFIG.timeout
axiosClient.defaults.headers.Accept = 'application/json'
axiosClient.defaults.withCredentials = true


// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (config.params) {
      Object.keys(config.params).forEach(
        (key) => config.params[key] === undefined && delete config.params[key]
      )
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const AxiosClientRequest = (config: AxiosRequestConfig) =>
  axiosClient(config).then((res) => res.data).catch((error: AxiosError) => {
    console.error('AxiosClientRequest error:', error);
    throw error;
  });

type AxiosRequestConfigType = Omit<AxiosRequestConfig, 'method'>

export const GET = (config: AxiosRequestConfigType) =>
  AxiosClientRequest({ method: 'GET', ...config })

export const POST = (config: AxiosRequestConfigType) =>
  AxiosClientRequest({ method: 'POST', ...config })

export const PUT = (config: AxiosRequestConfigType) =>
  AxiosClientRequest({ method: 'PUT', ...config })

export const PATCH = (config: AxiosRequestConfigType) =>
  AxiosClientRequest({ method: 'PATCH', ...config })

export const DELETE = (config: AxiosRequestConfigType) =>
  AxiosClientRequest({ method: 'DELETE', ...config })

export function setAuthHeader(token: string) {
  axiosClient.defaults.headers.Authorization = `${TOKEN_KEY} ${token}`
}

export function removeAuthHeader() {
  axiosClient.defaults.headers.common.Authorization = null
}

export function setOrgHeader(token: string) {
  axiosClient.defaults.headers.Organization = token
}

export function removeOrgHeader() {
  axiosClient.defaults.headers.common.Organization = null
}
