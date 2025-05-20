import api from './index' // 공통 axios 인스턴스 사용

export const newsAPI = {
  getNewsList: async (location) => {
    const response = await api.get('/news', {
      params: { location },
    })
    return response.data
  },

  getNewsSummary: async (newsItem) => {
    const response = await api.post('/news/summary', newsItem)
    console.log('응답:', response)
    return response.data
  },
}
