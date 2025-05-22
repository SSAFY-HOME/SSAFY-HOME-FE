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
  /**
   *  커뮤니티 글 작성 함수
   * @returns {Promise<Object>} 커뮤니티 작성 결과
   */
  writePost: async (postData) => {
    try {
      // API 요청
      const response = await api.post(`/community`, postData)
      return {
        status: 200,
        data: response.data,
        message: '커뮤니티 글을 성공적으로 작성했습니다.',
      }
    } catch (error) {
      console.error('커뮤니티 글 작성 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '커뮤니티 글 작성 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },

  /**
   * 커뮤니티 글 수정 함수
   * @param {Number} communityId - 수정할 커뮤니티 글 ID
   * @param {Object} data - 수정할 데이터 (title, content)
   * @returns {Promise<Object>} 커뮤니티 수정 결과
   */
  updatePost: async (communityId, data) => {
    try {
      // API 요청 - pathVariable로 communityId 전달, body로는 title과 content만 전달
      const response = await api.put(`/community/${communityId}`, {
        title: data.title,
        content: data.content,
      })

      return {
        status: 200,
        data: response.data,
        message: '커뮤니티 글을 성공적으로 수정했습니다.',
      }
    } catch (error) {
      console.error('커뮤니티 글 수정 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '커뮤니티 글 수정 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },

  /**
   *  커뮤니티 글 삭제 함수
   * @returns {Promise<Object>} 커뮤니티 삭제 결과
   */
  deletePost: async (communityId) => {
    try {
      // API 요청
      const response = await api.delete(`/community/${communityId}`)
      return {
        status: 200,
        data: response.data,
        message: '커뮤니티 글을 성공적으로 삭제했습니다.',
      }
    } catch (error) {
      console.error('커뮤니티 글 삭제 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '커뮤니티 글 삭제 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  /**
   *  커뮤니티 글 좋아요 함수
   * @returns {Promise<Object>} 커뮤니티 글 좋아요 결과
   */
  likePost: async (communityId) => {
    try {
      // API 요청
      const response = await api.post(`/community/like/${communityId}`)
      return {
        status: 200,
        data: response.data,
        message: '좋아요를 성공적으로 등록했습니다.',
      }
    } catch (error) {
      console.error('좋아요를 등록하는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '두 번 좋아요를 누를 수 없습니다.',
        error: error,
      }
    }
  },
  getUserPosts: async () => {
    try {
      // API 요청
      const response = await api.get(`/community/my-posts`)
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
