import api from './index'

/**
 * 멤버 관련 API 함수들
 */
export const memberAPI = {
  /**
   * 회원 가입 함수
   * @param {Object} userData - 회원 가입에 필요한 사용자 데이터
   * @param {string} userData.username - 사용자 이름
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.phone - 전화번호 (선택)
   * @returns {Promise<Object>} 회원 가입 결과
   */
  signUp: async (userData) => {
    try {
      // API 요청
      await api.post('/member/regist', userData)

      return {
        status: 200,
        message: '회원가입이 성공적으로 완료되었습니다.',
      }
    } catch (error) {
      console.error('회원가입 실패:', error)
      // 에러 응답을 구조화하여 반환
      return {
        status: 500,
        message: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },

  logIn: async (userData) => {
    try {
      const response = await api.post('/member/login', userData)

      if (response) {
        return {
          status: 200,
          message: '로그인이 성공적으로 완료되었습니다.',
          token: response.accessToken,
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      return {
        status: 500,
        message: error.response?.data?.message || '로그인 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
}
