import axios from 'axios'

/**
 * API 기본 인스턴스 설정
 * - 모든 API 호출에 공통으로 사용됨
 * - baseURL, 헤더, 인터셉터 등을 설정
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // 환경 변수에서 API URL 가져오기
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 설정
})

// 요청 인터셉터 - 필요시 토큰 추가 등을 위해 사용 가능
api.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져와 헤더에 추가
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 - 모든 응답에 공통으로 적용
api.interceptors.response.use(
  (response) => {
    // 응답이 있고 status 값이 있는 경우
    if (response.data.status) {
      // status가 200이면 성공으로 간주하고 data 필드 반환
      if (response.data.status === 200) {
        return response.data
      }
      // 그렇지 않으면 오류=
      else {
        return Promise.reject(
          new Error(response.data.message || '요청 처리 중 오류가 발생했습니다.'),
        )
      }
    }
    // 표준 응답 형식이 아닌 경우
    if (response.data.status === 500) {
      return Promise.reject(new Error(response.data.message || '서버에 오류가 발생했습니다.'))
    }
    return response.data
  },
  (error) => {
    // 401 에러 처리 (인증 만료)
    if (error.response && error.response.status === 401) {
      // 토큰 만료 시 로그아웃 처리나 토큰 갱신 로직 추가 가능
      localStorage.removeItem('accessToken')
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login'
    }

    // 네트워크 오류나 서버 오류 처리
    console.error('API 요청 실패:', error)
    return Promise.reject(error)
  },
)

export default api
