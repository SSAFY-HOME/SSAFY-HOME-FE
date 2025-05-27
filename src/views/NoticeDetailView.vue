<template>
  <AppHeader />
  <div class="notice-detail-container">
    <h1 class="notice-title">공지사항</h1>

    <div v-if="isLoading" class="loading-box">
      <p>공지사항을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button class="btn btn-list" @click="goToList">목록으로 돌아가기</button>
    </div>

    <div v-else class="notice-content-box">
      <!-- 게시물 헤더 영역 -->
      <div class="notice-header">
        <h2 class="post-title">{{ notice.title }}</h2>
        <div class="post-meta">
          <span class="post-author">작성자: 관리자</span>
          <span class="post-date">{{ notice.postDate }}</span>
          <span class="post-views">조회수: {{ notice.viewCount }}</span>
        </div>
      </div>

      <!-- 구분선 -->
      <div class="divider"></div>

      <!-- 게시물 내용 영역 -->
      <div class="post-content">
        <p v-if="notice.content">{{ notice.content }}</p>
        <p v-else class="no-content">내용이 없습니다.</p>
      </div>

      <!-- 버튼 영역 -->
      <div class="button-group">
        <button type="button" class="btn btn-cancel" @click="goBack">이전</button>
        <button type="button" class="btn btn-list" @click="goToList">목록</button>
        <!-- 관리자만 볼 수 있는 수정 및 삭제 버튼 -->
        <template v-if="isAdmin">
          <button type="button" class="btn btn-edit" @click="goToEdit">수정</button>
          <button type="button" class="btn btn-delete" @click="deleteNotice">삭제</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { noticeAPI } from '@/api/notice'
import AppHeader from '@/components/common/Header.vue'

const route = useRoute()
const router = useRouter()
const notice = ref({})
const isLoading = ref(true)
const error = ref(null)

// localStorage에서 관리자 여부 확인
const isAdmin = computed(() => {
  return localStorage.getItem('isAdmin') === 'true'
})

// 공지사항 상세 정보 가져오기
const fetchNoticeDetail = async () => {
  const id = route.params.id
  if (!id) return

  isLoading.value = true
  error.value = null

  try {
    // 공지사항 상세 정보 조회
    notice.value = await noticeAPI.getNoticeDetail(id)
  } catch (err) {
    error.value = '공지사항을 불러오는데 실패했습니다.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// 뒤로 가기
const goBack = () => {
  router.go(-1)
}

// 목록으로 이동
const goToList = () => {
  router.push('/notice')
}

// 수정 페이지로 이동
const goToEdit = () => {
  router.push(`/notice/edit/${route.params.id}`)
}

// 공지사항 삭제
const deleteNotice = async () => {
  // 삭제 확인
  if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
    return
  }

  try {
    // 삭제 API 호출
    await noticeAPI.deleteNotice(route.params.id)
    alert('공지사항이 삭제되었습니다.')
    // 목록 페이지로 이동
    router.push('/notice')
  } catch (err) {
    alert('공지사항 삭제 중 오류가 발생했습니다.')
    console.error(err)
  }
}

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchNoticeDetail()
})
</script>

<style scoped>
.notice-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.notice-title {
  font-size: 32px; /* 더 크게 변경 */
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center; /* 가운데 정렬 */
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.notice-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background-color: #4caf50;
  border-radius: 2px;
}

.notice-content-box {
  border: 1px solid #e0e0e0;
  padding: 30px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 게시물 헤더 */
.notice-header {
  margin-bottom: 20px;
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.post-author,
.post-date,
.post-views {
  display: flex;
  align-items: center;
}

.divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 20px 0;
}

/* 게시물 내용 */
.post-content {
  min-height: 200px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 30px;
  white-space: pre-line; /* 줄바꿈 보존 */
}

.no-content {
  color: #999;
  font-style: italic;
}

/* 버튼 영역 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 10px 24px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-list {
  background-color: #4caf50;
  color: white;
}

.btn-list:hover {
  background-color: #3d9140;
}

/* 수정 버튼 스타일 */
.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-edit:hover {
  background-color: #0b7dda;
}

.btn-delete {
  background-color: #eb4250;
  color: white;
}

.btn-delete:hover {
  background-color: #eb4250;
}

/* 로딩 및 에러 상태 */
.loading-box,
.error-box {
  padding: 40px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 20px;
}

.error-box {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.error-box .btn {
  margin-top: 15px;
}
</style>
