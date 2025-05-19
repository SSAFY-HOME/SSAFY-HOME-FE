
<template>
  <div>
    <AppHeader />
    <section class="news-list">
      <h1 class="title">부동산 뉴스</h1>
      <input v-model="searchQuery" @keyup.enter="searchNews" placeholder="동네를 검색하세요 ex.강남, 역삼동" class="search-input" />
      <div class="news-cards">
        <div v-for="news in newsList" :key="news.link" class="news-card" @click="goToDetail(news)">
          <img :src="news.image || defaultImage" alt="thumbnail" class="thumbnail" />
          <div class="news-info">
            <h3 v-html="news.title" class="news-title" />
            <p v-html="news.description" class="news-desc" />
            <p class="pub-date">{{ news.pubDate }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import { newsAPI } from '@/api/news'

const newsList = ref([])
const searchQuery = ref('')
const defaultImage = '/images/default-news.png'
const router = useRouter()

const fetchNews = async () => {
  const res = await newsAPI.getNewsList('')
  newsList.value = res.data.result
}

const searchNews = async () => {
  if (!searchQuery.value.trim()) return
  const res = await newsAPI.getNewsList(searchQuery.value)
  newsList.value = res.data.result
}

const goToDetail = (news) => {
  router.push({ name: 'NewsDetail', query: { link: news.link } })
}

onMounted(fetchNews)
</script>

<style scoped>
.news-list {
  padding: 2rem;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.search-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.news-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.news-card {
  display: flex;
  gap: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
}
.thumbnail {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}
.news-info {
  flex: 1;
}
.news-title {
  font-size: 1rem;
  font-weight: 600;
}
.news-desc {
  font-size: 0.875rem;
  color: #666;
}
.pub-date {
  font-size: 0.75rem;
  color: #999;
}
</style>