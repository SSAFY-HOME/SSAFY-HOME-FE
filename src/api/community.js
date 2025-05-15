import api from './index'

/**
 * 커뮤니티 API 관련 함수들
 */
export const communityAPI = {
  /**
   *  커뮤니티 글 목록 조회 함수
   * @returns {Promise<Object>} 커뮤니티 검색 결과
   */
  getPosts: async () => {
    try {
      // API 요청
      const response = await api.get(`/community`)
      return {
        status: 200,
        data: response.data,
        message: '커뮤니티 목록을 성공적으로 불러왔습니다.',
      }
    } catch (error) {
      console.error('커뮤니티 데이터를 불러오는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message:
          error.response?.data?.message || '커뮤니티 목록을 불러오는 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
}
