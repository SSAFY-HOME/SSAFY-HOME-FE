import api from './index' // 공통 axios 인스턴스 사용

export const newsAPI = {
  getNewsList: async (location) => {
    const response = await api.get('/news', {
      params: { location },
    })
    return response.data.result
  },

  getNewsSummary: async (link) => {
    const response = await api.get('/news/summary', {
      params: { link },
    })
    return response.data.result
  },
}