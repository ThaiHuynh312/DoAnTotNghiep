import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { apiRefreshToken } from '../services/authService'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  async function (config: CustomAxiosRequestConfig) {
    const tokenString = window.localStorage.getItem('access_token')
    let token: string | null = null

    if (tokenString) {
      try {
        token = tokenString
      } catch (e) {
        return Promise.reject(e)
      }
    }

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  function (error: AxiosError) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh_token = localStorage.getItem('refresh_token')
        if (refresh_token) {
          const response = await apiRefreshToken({ refresh_token })

          if (response) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)

            originalRequest.headers.Authorization = 'Bearer ' + response.data.access_token

            return instance(originalRequest)
          }
        } else {
          throw new Error('No refresh token available')
        }
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default instance
