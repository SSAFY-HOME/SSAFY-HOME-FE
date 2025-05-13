import api from './index'

/**
 * 지역 관련 API 함수들
 */
export const apartmentAPI = {
  /**
   * 시/도 목록을 가져오는 함수
   * @returns {Promise<Object>} 시/도 목록 또는 에러 정보
   */
  getProvinces: async () => {
    try {
      // API 요청
      const response = await api.get('/apartment')
      return {
        status: 200,
        data: response.data,
        message: '시/도 목록을 성공적으로 불러왔습니다.',
      }
    } catch (error) {
      console.error('시/도 데이터를 불러오는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        data: [],
        message: error.response?.data?.message || '시/도 목록을 불러오는 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  /**
   * 시/군/구 목록을 가져오는 함수
   * @param {number} sidoId - 시/도 ID
   * @returns {Promise<Object>} 시/군/구 목록 또는 에러 정보
   */
  getCities: async (sidoId) => {
    try {
      // API 요청
      const response = await api.get(`/apartment?sido=${sidoId}`)
      return {
        status: 200,
        data: response.data,
        message: '시/군/구 목록을 성공적으로 불러왔습니다.',
      }
    } catch (error) {
      console.error('시/군/구 데이터를 불러오는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message:
          error.response?.data?.message || '시/군/구 목록을 불러오는 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  getDistricts: async (gunguId) => {
    try {
      const response = await api.get(`/apartment?gungu=${gunguId}`)
      return {
        status: 200,
        data: response.data,
        message: '동 데이터를 성공적으로 불러왔습니다.',
      }
    } catch (error) {
      console.error('동 데이터를 불러오는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '동 목록을 불러오는 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
  getApartments: async (dongId) => {
    try {
      const response = await api.get(`apartment/list?dong=${dongId}`)
      return {
        status: 200,
        data: response.data,
        message: '아파트 데이터를 성공적으로 불러왔습니다.',
      }
    } catch (error) {
      console.error('아파트 데이터를 불러오는 중 오류가 발생했습니다:', error)
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '아파트 목록을 불러오는 중 오류가 발생했습니다.',
        error: error,
      }
    }
  },
}
