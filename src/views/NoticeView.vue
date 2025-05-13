<template>
  <AppHeader />
  <div class="notice-page-container">
    <div class="notice-header">
      <h1 class="page-title">공지사항</h1>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="text"
          placeholder="제목을 검색하세요"
          class="search-input"
          v-model="searchText"
          @keyup.enter="fetchNotices"
        />
        <button class="search-button" @click="fetchNotices">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="notice-list-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>공지사항을 불러오는 중입니다...</p>
      </div>

      <table v-else class="notice-table">
        <thead>
          <tr>
            <th class="column-number">번호</th>
            <th class="column-title">제목</th>
            <th class="column-author">작성자</th>
            <th class="column-date">작성일</th>
            <th class="column-views">조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="notice in notices"
            :key="notice.id"
            @click="viewNotice(notice)"
            class="notice-row"
          >
            <td class="column-number">{{ notice.id }}</td>
            <td class="column-title">{{ notice.title }}</td>
            <td class="column-author">관리자</td>
            <td class="column-date">{{ notice.postDate }}</td>
            <td class="column-views">{{ notice.viewCount }}</td>
          </tr>
          <tr v-if="notices.length === 0" class="empty-row">
            <td colspan="5" class="empty-message">공지사항이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        class="page-button"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>

    <div class="button-container">
      <button v-if="isAdmin" class="write-button" @click="writeNotice">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        작성하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/common/Header.vue'
import { noticeAPI } from '@/api/notice'
import { useRouter } from 'vue-router'

// 관리자 상태 (실제로는 사용자 권한에 따라 설정)
const isAdmin = ref(true)

// 검색 상태
const searchText = ref('')

// 현재 페이지
const currentPage = ref(1)
const totalPages = ref(1)
const totalElements = ref(0)

// 공지사항 데이터와 로딩 상태
const notices = ref([])
const loading = ref(false)
const router = useRouter()

// 공지사항 목록 불러오기
const fetchNotices = async () => {
  loading.value = true
  try {
    // API 요청
    const params = {
      page: currentPage.value - 1,
      size: 10,
      search: searchText.value || undefined,
    }

    const result = await noticeAPI.getNotices(params)
    console.log('API 응답 결과:', result)

    // 응답 데이터 처리
    notices.value = result.content || []
    totalPages.value = result.totalPages || 1
    totalElements.value = result.totalElements || 0

    console.log('화면에 표시할 공지사항:', notices.value)
    console.log('전체 항목 수:', totalElements.value)
  } catch (error) {
    console.error('공지사항 불러오기 오류:', error)
    notices.value = []
    // 에러 처리 (필요 시 사용자에게 알림)
  } finally {
    loading.value = false
  }
}

const checkIsAdmin = () => {
  const adminValue = localStorage.getItem('isAdmin')
  // adminValue가 "true"인 경우에만 관리자로 설정
  isAdmin.value = adminValue === 'true'
  console.log(isAdmin.value)
  return isAdmin.value
}

// 페이지 변경
const changePage = (page) => {
  if (currentPage.value !== page) {
    currentPage.value = page
    fetchNotices()
  }
}

// 공지사항 상세 페이지로 이동
const viewNotice = (notice) => {
  if (!notice || !notice.id) {
    console.error('유효하지 않은 공지사항입니다:', notice)
    return
  }

  // 공지사항 상세 페이지로 이동
  router.push(`/notice/${notice.id}`)
}

const writeNotice = () => {
  // 로컬 스토리지에서 액세스 토큰 확인
  const accessToken = localStorage.getItem('accessToken')

  // 토큰이 없거나 빈 문자열인 경우 로그인 페이지로 리다이렉트
  if (!accessToken) {
    alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.')
    router.push('/login?redirect=' + encodeURIComponent('/notice/write'))
    return
  }
  router.push('/notice/write')
}

// 컴포넌트 마운트시 공지사항 로드
onMounted(() => {
  checkIsAdmin()
  fetchNotices()
})
</script>

<style scoped>
.notice-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family:
    'Pretendard',
    'Apple SD Gothic Neo',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}

.notice-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  position: relative; /* 추가: after 요소의 기준점 설정 */
  padding-bottom: 15px; /* 추가: 밑줄과의 간격 확보 */
  display: inline-block; /* 추가: 텍스트 너비에 맞게 조정 */
}

.page-title::after {
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

.page-description {
  font-size: 16px;
  color: #666;
}

.search-container {
  margin-bottom: 24px;
}

.search-input-wrapper {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
}

.search-button {
  width: 48px;
  height: 48px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #43a047;
}

.notice-list-container {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 200px;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(76, 175, 80, 0.3);
  border-radius: 50%;
  border-top-color: #4caf50;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.notice-table {
  width: 100%;
  border-collapse: collapse;
}

.notice-table thead {
  background-color: #f5f5f5;
}

.notice-table th {
  padding: 16px;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.notice-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.notice-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.notice-row:hover {
  background-color: #f9f9f9;
}

.empty-row {
  height: 150px;
}

.empty-message {
  text-align: center;
  color: #888;
  font-size: 16px;
}

.column-number {
  width: 70px;
  text-align: center;
}

.column-title {
  width: auto;
}

.column-author {
  width: 100px;
  text-align: center;
}

.column-date {
  width: 120px;
  text-align: center;
}

.column-views {
  width: 80px;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.page-button {
  width: 36px;
  height: 36px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-button:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.page-button.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.write-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.write-button:hover {
  background-color: #43a047;
}

@media (max-width: 768px) {
  .notice-page-container {
    padding: 24px 16px;
  }

  .column-author,
  .column-views {
    display: none;
  }

  .page-title {
    font-size: 24px;
  }

  .notice-table th,
  .notice-table td {
    padding: 12px 8px;
  }
}
</style>
