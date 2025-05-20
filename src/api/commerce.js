import api from './index'

/**
 * 카카오 API 관련 함수들
 */
export const kakaoAPI = {
  /**
   * 키워드로 장소 검색 함수
   * @param {Object} params - 장소 검색에 필요한 파라미터
   * @param {string} params.query - 검색할 키워드 (필수)
   * @param {string} params.categoryGroupCode - 카테고리 그룹 코드 (선택)
   * @returns {Promise<Object>} 장소 검색 결과
   */
  searchPlaces: async (params) => {
    const { query, categoryGroupCode = '' } = params

    try {
      // API 요청
      const response = await api.get('/api/kakao/places', {
        params: {
          query,
          category_group_code: categoryGroupCode,
        },
      })

      // 응답 데이터 정형화
      return {
        status: response.status,
        message: response.message,
        data: response.statusdata?.content || [],
      }
    } catch (error) {
      console.error('장소 검색 실패:', error)

      // 에러 응답을 구조화하여 반환
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || '장소 검색 중 오류가 발생했습니다.',
        data: [],
        error,
      }
    }
  },

  /**
   * 특정 동네의 주변 상권을 검색하는
   * @param {Object} params - 상권 검색에 필요한 파라미터
   * @param {string} params.city - 도시명
   * @param {string} params.district - 동 이름
   * @param {string} params.keyword - 추가 검색어 (선택)
   * @param {string} params.categoryGroupCode - 카테고리 그룹 코드 (선택)
   * @returns {Promise<Object>} 상권 검색 결과
   */
  searchNearbyCommerces: async (params) => {
    const { city, district, categoryGroupCode = '' } = params

    // 동 이름을 기준으로 검색할 키워드 생성
    const searchKeyword = ` ${city} ${district}`.trim()
    console.log('응답', searchKeyword)

    try {
      // API 요청
      const response = await api.get('http://localhost:8080/api/kakao/places', {
        params: {
          query: searchKeyword,
          category_group_code: categoryGroupCode,
        },
      })

      // 응답 데이터 정형화
      return {
        status: response.status,
        message: response.message,
        data: response.data || [],
      }
    } catch (error) {
      console.error('주변 상권 검색 실패:', error)

      // 에러 응답을 구조화하여 반환
      return {
        status: error.response?.data.status || 500,
        message: error.response?.data?.message || '주변 상권 검색 중 오류가 발생했습니다.',
        data: [],
        error,
      }
    }
  },

  /**
   * 카테고리 그룹 코드 목록
   * 참고용으로 제공되는 상수 객체
   */
  CATEGORY_GROUP_CODES: {
    MART: 'MT1', // 대형마트
    CONVENIENCE: 'CS2', // 편의점
    KINDERGARTEN: 'PS3', // 어린이집, 유치원
    SCHOOL: 'SC4', // 학교
    ACADEMY: 'AC5', // 학원
    PARKING: 'PK6', // 주차장
    GAS_STATION: 'OL7', // 주유소, 충전소
    SUBWAY: 'SW8', // 지하철역
    BANK: 'BK9', // 은행
    CULTURE: 'CT1', // 문화시설
    AGENCY: 'AG2', // 중개업소
    PUBLIC: 'PO3', // 공공기관
    TOURIST: 'AT4', // 관광명소
    ACCOMMODATION: 'AD5', // 숙박
    RESTAURANT: 'FD6', // 음식점
    CAFE: 'CE7', // 카페
    HOSPITAL: 'HP8', // 병원
    PHARMACY: 'PM9', // 약국
  },
}
