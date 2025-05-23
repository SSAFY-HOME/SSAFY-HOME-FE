<template>
  <div class="news-detail-container">
    <AppHeader />

    <div class="news-detail-content">
      <div class="breadcrumb">
        <router-link to="/news" class="breadcrumb-item">부동산 뉴스</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">뉴스 상세</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>뉴스를 불러오는 중입니다...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle error-icon"></i>
        <p class="error-message">{{ error }}</p>
        <button @click="goBack" class="btn-back">이전으로 돌아가기</button>
      </div>

      <!-- Content -->
      <div v-else class="news-detail">
        <div class="news-header">
          <h1 class="news-title">{{ newsDetail.title }}</h1>

          <div class="news-meta">
            <div class="news-source">
              <span class="source-label">출처:</span>
              <span class="source-value">{{
                newsDetail.link ? extractDomainFromUrl(newsDetail.link) : '미상'
              }}</span>
            </div>
            <div class="publish-date">{{ newsDetail.pubDate }}</div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Main Content -->
        <div class="article-content-wrapper">
          <!-- News Image (if available) -->
          <div v-if="newsDetail.image" class="article-image-container">
            <img :src="newsDetail.image" alt="News Image" class="article-image" />
          </div>

          <div class="content-layout">
            <!-- Original Article Content - Left Side -->
            <div class="article-original-content">
              <h3 class="content-section-title">뉴스 내용</h3>
              <div class="article-description">
                {{ newsDetail.content }}
              </div>
            </div>

            <!-- AI Summary - Right Side -->
            <div class="article-sidebar">
              <div class="ai-summary">
                <div class="summary-header">
                  <i class="fas fa-robot"></i>
                  <span>AI 뉴스 요약</span>
                  <button
                    v-if="!newsSummary && !isSummaryLoading"
                    @click="generateSummary"
                    class="summary-generate-btn"
                  >
                    <i class="fas fa-magic"></i> 요약 생성
                  </button>
                </div>

                <!-- Summary Loading -->
                <div v-if="isSummaryLoading" class="summary-loading">
                  <div class="summary-spinner"></div>
                  <span>AI가 뉴스를 요약하고 있습니다...</span>
                </div>

                <!-- Summary Content -->
                <div v-else-if="newsSummary" class="summary-content">
                  {{ newsSummary }}
                </div>

                <!-- Auto generating message -->
                <div v-else class="summary-auto-generating">
                  <i class="fas fa-clock"></i>
                  <span>AI 요약이 자동으로 생성됩니다...</span>
                </div>
              </div>

              <!-- Original Link -->
              <div v-if="newsDetail.link" class="original-article">
                <a :href="newsDetail.link" target="_blank" class="original-link">
                  <i class="fas fa-external-link-alt"></i> 원본 기사 보기
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Locations -->
        <div
          v-if="newsDetail.locations && newsDetail.locations.length > 0"
          class="related-locations"
        >
          <h3 class="section-title">관련 지역</h3>
          <div class="location-tags">
            <span
              v-for="location in newsDetail.locations"
              :key="location"
              class="location-tag"
              @click="searchByLocation(location)"
            >
              {{ location }}
            </span>
          </div>
        </div>

        <!-- Tags -->
        <div class="article-tags">
          <span class="tag">#부동산</span>
          <span class="tag">#아파트</span>
          <span class="tag">#매매</span>
          <span class="tag">#투자</span>
        </div>

        <div class="divider"></div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button @click="goBack" class="nav-button prev-button">
            <i class="fas fa-arrow-left"></i> 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import { newsAPI } from '@/api/news'

const route = useRoute()
const router = useRouter()
const newsDetail = ref({})
const isLoading = ref(true)
const error = ref(null)
const newsSummary = ref('')
const isSummaryLoading = ref(false)

const newsItem = {
  title: route.query.title,
  pubDate: route.query.pubDate,
  link: route.query.link,
}

// 뉴스 상세 정보 가져오기
const fetchNewsDetail = async () => {
  if (!route.query.title || !route.query.pubDate || !route.query.link) {
    error.value = '뉴스 정보를 찾을 수 없습니다.'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // 뉴스 상세 정보 가져오기
    const res = await newsAPI.getNewsDetail(newsItem)
    newsDetail.value = {
      title: res.title || newsItem.title || '제목 없음',
      pubDate: res.pubDate || newsItem.pubDate || '날짜 정보 없음',
      link: res.link || newsItem.link,
      content: res.content || '내용 없음',
      image: res.image,
      locations: res.locations,
    }

    // 뉴스 정보 로딩 완료 후 화면 표시
    isLoading.value = false

    // 뉴스 정보가 화면에 표시된 후 별도로 요약 생성 시작
    generateSummary()
  } catch (err) {
    console.error('Error fetching news detail:', err)
    error.value = '뉴스를 불러오는데 실패했습니다.'
    isLoading.value = false
  }
}

// 요약 생성 함수
const generateSummary = async () => {
  try {
    isSummaryLoading.value = true

    // NewsSummaryResDto 형식으로 요약 요청
    const summaryRequest = {
      title: newsDetail.value.title,
      content: newsDetail.value.content,
      pubDate: newsDetail.value.pubDate,
      link: newsDetail.value.link,
    }

    const res = await newsAPI.getNewsSummary(summaryRequest)
    newsSummary.value = res.summary || '요약 정보 없음'
  } catch (err) {
    console.error('Error generating news summary:', err)
    // 요약 생성 실패는 치명적이지 않으므로 에러 상태로 설정하지 않음
    newsSummary.value = '요약을 생성할 수 없습니다.'
  } finally {
    isSummaryLoading.value = false
  }
}

const extractDomainFromUrl = (url) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return '미상'
  }
}

const goBack = () => {
  router.back()
}

const searchByLocation = (location) => {
  router.push({
    path: '/news',
    query: { location },
  })
}

// 라우트 변경 감지
watch(
  () => route.query.link,
  (newLink) => {
    if (newLink) {
      // 새로운 뉴스 아이템 설정
      Object.assign(newsItem, {
        title: route.query.title,
        pubDate: route.query.pubDate,
        link: route.query.link,
      })

      // 상태 초기화
      newsSummary.value = ''
      isSummaryLoading.value = false
      error.value = null

      fetchNewsDetail()
    }
  },
)

// 컴포넌트 마운트
onMounted(() => {
  fetchNewsDetail()
})
</script>

<style scoped>
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.news-detail-container {
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f7f9fc;
  min-height: 100vh;
}

.news-detail-content {
  max-width: 1080px;
  margin: 0 auto;
  padding: 30px 20px 50px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
}

.breadcrumb-item.current {
  color: #4caf50;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #eb4250;
  margin-bottom: 16px;
}

.error-message {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.btn-back {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background-color: #3d9140;
}

/* News Detail */
.news-detail {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.news-header {
  padding: 24px 30px;
}

.news-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #333;
  margin-bottom: 16px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}

.news-source {
  display: flex;
  align-items: center;
  gap: 5px;
}

.source-label {
  color: #888;
}

.source-value {
  font-weight: 500;
}

.publish-date {
  color: #888;
}

.divider {
  height: 1px;
  background-color: #eee;
}

/* Article Content */
.article-content-wrapper {
  padding: 30px;
}

.article-image-container {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

/* Two-column layout */
.content-layout {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.content-section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  position: relative;
  padding-left: 12px;
}

.content-section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #4caf50;
  border-radius: 2px;
}

/* Left column - Original content */
.article-original-content {
  flex: 3;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.article-description {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

/* Right column - AI Summary and original link */
.article-sidebar {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ai-summary {
  background-color: #f5fbf5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4caf50;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 12px;
  color: #4caf50;
}

.summary-header > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-generate-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.summary-generate-btn:hover {
  background-color: #3d9140;
  transform: translateY(-1px);
}

.summary-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  color: #666;
  font-size: 14px;
}

.summary-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.summary-content {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

.summary-auto-generating {
  color: #4caf50;
  font-size: 14px;
  padding: 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.summary-auto-generating i {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.original-article {
  text-align: center;
}

.original-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  color: #4caf50;
  font-size: 14px;
  text-decoration: none;
  padding: 12px 16px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  transition: all 0.2s ease;
  background-color: #fff;
}

.original-link:hover {
  background-color: #4caf50;
  color: white;
}

/* Related Locations */
.related-locations {
  padding: 0 30px 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.location-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-tag {
  background-color: #e9f5ea;
  color: #4caf50;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.location-tag:hover {
  background-color: #4caf50;
  color: white;
}

/* Tags */
.article-tags {
  padding: 0 30px 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 13px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tag:hover {
  color: #4caf50;
}

/* Navigation Buttons */
.navigation-buttons {
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
}

.nav-button {
  background: none;
  border: none;
  color: #4caf50;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.nav-button:hover {
  color: #3d9140;
}

/* Responsive Design */
@media (max-width: 900px) {
  .content-layout {
    flex-direction: column;
  }

  .article-sidebar {
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .news-detail-content {
    padding: 20px 15px 40px;
  }

  .news-header {
    padding: 20px;
  }

  .news-title {
    font-size: 20px;
  }

  .article-content-wrapper {
    padding: 20px;
  }

  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .related-locations,
  .article-tags {
    padding: 0 20px 20px;
  }

  .navigation-buttons {
    padding: 15px 20px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .summary-generate-btn {
    align-self: flex-end;
  }
}
</style>
