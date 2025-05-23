import api from './index' // 공통 axios 인스턴스 사용

export const newsAPI = {
  getNewsList: async (location) => {
    const response = await api.get('/news', {
      params: { location },
    })
    return response.data
  },

  getNewsDetail: async (newsItem) => {
    const response = await api.post('/news/detail', newsItem)
    return response.data
  },
  getNewsSummary: async (newsContent) => {
    const response = await api.post('/news/summary', newsContent)
    return response.data
  },
}
