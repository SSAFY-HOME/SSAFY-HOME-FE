import api from './index'

/**
 * 공지사항 관련 API 함수들
 */
export const noticeAPI = {
  /**
   * 공지사항 목록을 페이징하여 조회
   *
   * @param {Object} params - 요청 파라미터
   * @param {number} params.page - 페이지 번호 (0부터 시작)
   * @param {number} params.size - 페이지 크기
   * @param {string} params.search - 검색어 (선택)
   * @returns {Promise<Array>} 공지사항 목록
   */

  getNotices: async (params = { page: 0, size: 10 }) => {
    try {
      // API 요청
      const response = await api.get('/notice', { params })
      if (response.data) {
        return {
          content: response.data.content,
          totalPages: response.data.totalPages || 1,
          totalElements: response.data.totalElements || 0,
          pageNumber: response.data.pageNumber,
        }
      }
      return {
        content: [],
        totalPages: 1,
        totalElements: 0,
        pageNumber: 0,
      }
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error)
      throw error
    }
  },
  /**
   * 단일 공지사항 상세 정보 조회
   *
   * @param {number} id - 조회할 공지사항 ID
   * @returns {Promise<Object>} 공지사항 상세 정보
   */
  getNoticeDetail: async (id) => {
    try {
      // API 요청
      const response = await api.get(`/notice/${id}`)

      if (response.data) {
        // 성공 시 공지사항 데이터 반환
        return response.data
      } else {
        throw new Error('공지사항 데이터를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error(`공지사항 상세 조회 실패 (ID: ${id}):`, error)
      throw error
    }
  },

  /**
   * 새 공지사항 등록
   *
   * @param {Object} noticeData - 공지사항 데이터
   * @param {string} noticeData.title - 공지사항 제목
   * @param {string} noticeData.content - 공지사항 내용
   * @returns {Promise<Object>} 생성된 공지사항 정보
   * @throws {Error} 등록 실패시 오류
   */
  createNotice: async (noticeData) => {
    try {
      if (!noticeData.title || !noticeData.content) {
        throw new Error('제목과 내용을 모두 입력해주세요.')
      }

      // API 요청
      const response = await api.post('/notice', noticeData)
      console.log(response)

      // 서버 응답에서 오류 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      if (response && response.status != 200) {
        throw new Error(response.message || '공지사항 등록에 실패했습니다.')
      }

      // 성공 시 생성된 공지사항 데이터 반환
      return {
        success: true, // success 값을 true로 변경 (200은 status 코드에 적합)
        message: '공지사항이 성공적으로 등록되었습니다.',
        data: response, // 서버로부터 받은 데이터 (필요시)
      }
    } catch (error) {
      console.error('공지사항 등록 실패:', error)
      throw error
    }
  } /**
   * 공지사항 수정
   *
   * @param {string} noticeId - 수정할 공지사항 ID
   * @param {Object} noticeData - 공지사항 데이터
   * @param {string} noticeData.title - 공지사항 제목
   * @param {string} noticeData.content - 공지사항 내용
   * @returns {Promise<Object>} 수정된 공지사항 정보
   * @throws {Error} 수정 실패시 오류
   */,
  updateNotice: async (noticeId, noticeData) => {
    try {
      // 유효성 검사
      if (!noticeId) {
        throw new Error('공지사항 ID가 필요합니다.')
      }

      if (!noticeData.title || !noticeData.content) {
        throw new Error('제목과 내용을 모두 입력해주세요.')
      }

      // 요청 본문에 title과 content만 포함하도록
      const requestBody = {
        title: noticeData.title,
        content: noticeData.content,
      }

      // API 요청
      const response = await api.put(`/notice/${noticeId}`, requestBody)

      // 서버 응답에서 오류 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      if (response && response.status != 200) {
        throw new Error(response.message || '공지사항 수정에 실패했습니다.')
      }

      // 성공 시 수정된 공지사항 데이터 반환
      return {
        success: true,
        message: '공지사항이 성공적으로 수정되었습니다.',
        data: response,
      }
    } catch (error) {
      console.error('공지사항 수정 실패:', error)
      throw error
    }
  },

  /**
   * 공지사항 삭제
   *
   * @param {string} noticeId - 삭제할 공지사항 ID
   * @returns {Promise<Object>} 삭제 결과
   * @throws {Error} 삭제 실패시 오류
   */ deleteNotice: async (noticeId) => {
    try {
      // 유효성 검사
      if (!noticeId) {
        throw new Error('공지사항 ID가 필요합니다.')
      }

      // API 요청
      const response = await api.delete(`/notice/${noticeId}`)

      // 서버 응답에서 오류 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      if (response && response.status != 200) {
        throw new Error(response.message || '공지사항 삭제에 실패했습니다.')
      }

      // 성공 시 결과 반환
      return {
        success: true,
        message: '공지사항이 성공적으로 삭제되었습니다.',
        data: response,
      }
    } catch (error) {
      console.error('공지사항 삭제 실패:', error)
      throw error
    }
  },
}
