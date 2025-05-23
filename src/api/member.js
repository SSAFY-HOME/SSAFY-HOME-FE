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

      if (response.data) {
        return {
          status: 200,
          message: '로그인이 성공적으로 완료되었습니다.',

          data: response.data,
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      return {
        status: 500,
        message: '로그인 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  registHome: async (aptData) => {
    try {
      const response = await api.post('/member/home', aptData)
      // 서버 응답에서 오류 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      if (response && response.status != 200) {
        throw new Error(response.message || '아파트 등록에 실패했습니다.')
      }

      // 성공 시 결과 반환
      return {
        success: true,
        message: '아파트 등록이 성공적으로 되었습니다.',
        data: response,
      }
    } catch (error) {
      console.error('아파트 등록 실패:', error)
      throw error
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/member/info')
      if (response === undefined || response == null) {
        throw new Error('서버 응답이 없습니다.')
      }
      if (response && response.status != 200) {
        throw new Error(response.message || '마이페이지 조회에 실패했습니다.')
      }
      return {
        success: true,
        message: '마이페이지 조회가 성공적으로 되었습니다.',
        data: response.data,
      }
    } catch (error) {
      console.error('프로필 조회 실패', error)
      throw error
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      await api.put('/member/password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
      })
    } catch (error) {
      console.error('비밀번호 수정 실패', error)
      throw error
    }
  },
  reissue: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      const response = await api.post(
        '/member/reissue',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken,
          },
        },
      )

      // 새 accessToken 반환
      return response
    } catch (error) {
      console.error('토큰 재발급 실패:', error)
      throw error
    }
  },

  deleteMember: async (password) => {
    try {
      await api.delete('/member', { password })
    } catch (error) {
      console.error('회원 탈퇴 실패', error)
      throw error
    }
  },
  uploadProfileImage: async (formData) => {
    try {
      const response = await api.post('/member/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('프로필 이미지 수정 실패', error)
      throw error
    }
  },
  kakaoWithdrawByCode: async (code) => {
    try {
      const response = await api.post(`/oauth/withdraw?code=${code}`)
      return response.data
    } catch (error) {
      console.error('카카오 회원 탈퇴 실패:', error)
      throw error
    }
  },
  getFavoriteApartments: async () => {
    try {
      const response = await api.get('/like')
      if (response === undefined || response == null) {
        throw new Error('서버 응답이 없습니다.')
      }
      if (response && response.status != 200) {
        throw new Error(response.message || '관심 아파트 조회에 실패했습니다.')
      }
      return {
        success: true,
        message: '관심 아파트 조회가 성공적으로 되었습니다.',
        data: response.data,
      }
    } catch (error) {
      console.error('관심 아파트 조회 실패', error)
      throw error
    }
  },
}
