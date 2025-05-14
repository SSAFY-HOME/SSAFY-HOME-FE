import api from './index'

export const dealAPI = {
  /**
   * 아파트 거래 내역 조회 함수
   * @param {number} aptSeq - 아파트 식별 번호
   * @returns {Promise<Object>} - 거래 내역 데이터
   */
  getDealHistory: async (aptSeq) => {
    try {
      const cleanedAptSeq = String(aptSeq).replaceAll("'", '')
      const response = await api.get(`/deal?aptSeq=${cleanedAptSeq}`)

      // 응답 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      // 상태 코드 확인
      if (response && response.status !== 200) {
        throw new Error(response.message || '거래 내역 조회에 실패했습니다.')
      }

      // 성공 응답 반환
      return {
        success: true,
        message: '거래 내역 조회가 성공적으로 되었습니다.',
        data: response.data.deals,
      }
    } catch (error) {
      console.error('거래 내역 조회 실패', error)
      throw error
    }
  },
}
