import api from './index'

export const riskAPI = {
  /**
   * 허위매물 위험도 평가 함수
   * @param {string} sgg
   * @param {string} startYm
   * @param {string} endYm
   * @returns {Promise<Object>}
   */
  evaluateRisk: async (sgg, startYm, endYm) => {
    try {
      const response = await api.get('/risk/evaluate', {
        params: {
          sgg: sgg,
          startYm: startYm,
          endYm: endYm,
        },
      })

      // 응답 확인
      if (response === undefined || response === null) {
        throw new Error('서버 응답이 없습니다.')
      }

      // 성공 응답 반환
      return {
        success: true,
        message: '허위매물 위험도 조회가 성공적으로 되었습니다.',
        data: response.data,
      }
    } catch (error) {
      console.error('허위매물 위험도 조회 실패', error)
      throw error
    }
  },
}
