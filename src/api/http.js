import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://gta-api-ns0d.onrender.com',
  timeout: 10000
})