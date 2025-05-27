import api from './index'

export const chatAPI = {
  /**
   * 채팅 메시지 전송 API 호출 함수
   * @param {Object} messageData - 전송할 메시지 데이터 { message: string, otherParams... }
   * @returns {Promise<Object>} 메시지 전송 결과
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/chat', messageData)

      return {
        status: response.status,
        data: response.data,
        message: '메시지가 성공적으로 전송되었습니다.',
      }
    } catch (error) {
      console.error('메시지 전송 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '메시지 전송 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  /**
   * 채팅 메시지 목록 가져오기 API 호출 함수
   * @returns {Promise<Object>} 메시지 목록
   *
   */
  getMessages: async () => {
    try {
      const response = await api.get('/chat')

      return {
        status: response.status,
        data: response.data,
        message: '메시지 목록을 성공적으로 가져왔습니다.',
      }
    } catch (error) {
      console.error('메시지 목록 가져오기 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '메시지 목록 가져오기 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  async getAptSummary(aptId, aptName) {
    const res = await api.get('/chat/summary', {
      params: { aptId, aptName },
    })
    return res.data
  },
}
