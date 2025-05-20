<template>
  <div class="news-container">
    <AppHeader />

    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="main-title">부동산 뉴스</h1>
      <div class="search-container">
        <input
          v-model="searchQuery"
          @keyup.enter="searchNews"
          placeholder="지역을 검색하세요 ex.서울, 강남구, 역삼동"
          class="search-input"
        />
        <button @click="searchNews" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <!-- News Content -->
    <div class="content-container">
      <!-- Filter and Sort Options -->
      <div class="filter-section">
        <div class="tabs">
          <span class="tab active">최신순</span>
        </div>
      </div>

      <!-- News List -->
      <div class="news-list">
        <div v-for="news in newsList" :key="news.link" class="news-item" @click="goToDetail(news)">
          <div class="news-content">
            <h3 class="news-title" v-html="news.title"></h3>
            <p class="news-description" v-html="news.description"></p>
            <div class="news-meta">
              <span class="news-date">{{ news.pubDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && newsList.length === 0" class="empty-state">
        <i class="far fa-newspaper empty-icon"></i>
        <p>검색 결과가 없습니다.</p>
        <p class="empty-subtext">다른 키워드로 검색해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import { newsAPI } from '@/api/news'

const newsList = ref([])
const searchQuery = ref('')
const router = useRouter()
const isLoading = ref(false)

const fetchNews = async () => {
  try {
    isLoading.value = true
    const res = await newsAPI.getNewsList('')
    newsList.value = res
  } catch (error) {
    console.error('뉴스를 불러오는데 실패했습니다:', error)
  } finally {
    isLoading.value = false
  }
}

const searchNews = async () => {
  if (!searchQuery.value.trim()) return
  try {
    isLoading.value = true
    const res = await newsAPI.getNewsList(searchQuery.value)
    newsList.value = res
  } catch (error) {
    console.error('뉴스 검색에 실패했습니다:', error)
  } finally {
    isLoading.value = false
  }
}

const goToDetail = (news) => {
  router.push({
    name: 'NewsDetail',
    query: { title: news.title, pubDate: news.pubDate, link: news.link },
  })
}

onMounted(fetchNews)
</script>

<style scoped>
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.news-container {
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f7f9fc;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  background-color: #fff;
  padding: 40px 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 2px 15px rgba(76, 175, 80, 0.15);
}

.search-button {
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: #3d9140;
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: 16px;
}

.tab {
  font-size: 15px;
  color: #666;
  cursor: pointer;
  padding-bottom: 5px;
  transition: all 0.2s ease;
}

.tab.active {
  color: #4caf50;
  font-weight: 500;
  border-bottom: 2px solid #4caf50;
}

.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #f1f3f5;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-badge.active {
  background-color: #4caf50;
  color: white;
}

/* News List */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 200px;
  min-width: 200px;
  height: 150px;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.news-date {
  font-size: 13px;
  color: #888;
}

.news-actions {
  display: flex;
  gap: 15px;
}

.action-item {
  font-size: 13px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #888;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ccc;
}

.empty-subtext {
  font-size: 14px;
  margin-top: 5px;
  color: #aaa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    height: 180px;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .category-filter {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
    justify-content: flex-start;
  }
}
</style>
