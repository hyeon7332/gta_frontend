import axios from 'axios'

// 공통 Axios HTTP 클라이언트 생성
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000
})

// 요청 인터셉터 추가
http.interceptors.request.use(
  (config) => {
    // 저장된 JWT 토큰 조회
    const token = localStorage.getItem('accessToken')

    // 토큰 존재 시 Authorization 헤더 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 추가
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 인증 만료(401) 시 로그인 정보 삭제 후 로그인 페이지 이동
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('loginId')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)