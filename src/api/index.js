import axios from 'axios'
import { memberAPI } from '@/api/member'
import { useMemberStore } from '@/stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// 요청 인터셉터 - accessToken 붙이기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 - 자동 재발급 포함
api.interceptors.response.use(
  (response) => {
    if (response.data.status === 200) {
      return response.data
    } else if (response.data.status === 500) {
      return Promise.reject(new Error(response.data.message || '서버에 오류가 발생했습니다.'))
    } else {
      return Promise.reject(new Error(response.data.message || '요청 처리 중 오류가 발생했습니다.'))
    }
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러 + 재시도 안 된 요청 + refreshToken 존재 시 → 자동 재발급 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true
      try {
        const response = await memberAPI.reissue()
        const newAccessToken = response.data.accessToken

        // 새 accessToken 저장
        localStorage.setItem('accessToken', newAccessToken)

        // (선택) Pinia store 갱신
        try {
          const memberStore = useMemberStore()
          memberStore.setAccessToken(newAccessToken)
        } catch (e) {
          console.warn('Pinia store 업데이트 생략됨: setup() 외부이거나 아직 초기화되지 않음')
        }

        // 기존 요청에 새 토큰 반영 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (reissueError) {
        console.error('토큰 재발급 실패:', reissueError)
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/login'
        return Promise.reject(reissueError)
      }
    }

    // 기타 에러 처리
    console.error('API 요청 실패:', error)
    return Promise.reject(error)
  }
)

export default api
