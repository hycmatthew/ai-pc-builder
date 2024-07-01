import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios'
import config from '../config/config'

interface Config extends AxiosRequestConfig {
  rawResponse?: boolean
}

export class HttpHelper {
  axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  request(options: Config) {
    const onSuccess = function (response: AxiosResponse) {
      const res = response.data
      return res || ''
    }

    const onError = function (error: AxiosError) {
      console.error('Request Failed:', error)

      if (error.response) {
        // Request was made but server responded with something
        // other than 2xx
        console.error('Response:', error.response)
      }

      return Promise.reject(error.response || error.message)
    }

    return this.axiosInstance(options).then(onSuccess).catch(onError)
  }

  get(url: string, params?: any, axiosConfig?: Config) {
    return this.request({
      url,
      method: 'GET',
      params,
      ...axiosConfig,
    })
  }

  post(url: string, data?: any, axiosConfig?: Config) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...axiosConfig,
    })
  }
}

const RawDataAPI = new HttpHelper(config.RAW_DATA_API)
const EpicGameDataAPI = new HttpHelper(config.EPIC_FREE_GAME_API)

export { RawDataAPI, EpicGameDataAPI }
