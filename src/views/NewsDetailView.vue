<!-- 📰 NewsDetailView.vue -->
<template>
  <div>
    <AppHeader />
    <section class="news-detail">
      <article class="content">
        <h1 class="news-title">{{ article?.title }}</h1>
        <p class="meta">
          {{ article?.pubDate }} · {{ article?.origin || '출처 불명' }}
        </p>
        <div v-html="article?.description" class="news-body"></div>
      </article>
      <aside class="summary">
        <h3>AI 요약</h3>
        <p v-if="summary">{{ summary }}</p>
        <p v-else>요약을 불러오는 중...</p>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import { getNewsSummary } from '@/api/news.js'

const route = useRoute()
const article = ref({
  title: '',
  description: '',
  link: '',
  pubDate: '',
  origin: '',
})
const summary = ref('')

onMounted(async () => {
  const link = route.query.link
  if (!link) return

  const response = await getNewsSummary(link)
  summary.value = response.data.result.summary

  // 간단한 크롤링/파싱용 예시
  article.value = {
    title: document.title || '기사 제목',
    link,
    pubDate: new Date().toLocaleString(),
    description: '전체 본문 내용이 여기 들어옵니다 (프론트에서 파싱하거나 백에서 제공 필요)',
  }
})
</script>

<style scoped>
.news-detail {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}
.content {
  flex: 2;
}
.summary {
  flex: 1;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 10px;
}
.news-title {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.meta {
  color: #888;
  margin-bottom: 1.5rem;
}
.news-body {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
