<template>
  <AppHeader />
  <div class="notice-edit-container">
    <h1 class="notice-title">공지사항 수정</h1>

    <div v-if="isLoading" class="loading-box">
      <p>공지사항을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button class="btn btn-list" @click="goToList">목록으로 돌아가기</button>
    </div>

    <div v-else class="notice-form-box">
      <!-- 게시물 제목 입력 -->
      <div class="form-group">
        <label for="title" class="form-label">제목</label>
        <input
          type="text"
          id="title"
          v-model="notice.title"
          class="form-control"
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      <!-- 구분선 -->
      <div class="divider"></div>

      <!-- 게시물 내용 입력 -->
      <div class="form-group">
        <label for="content" class="form-label">내용</label>
        <textarea
          id="content"
          v-model="notice.content"
          class="form-control content-textarea"
          placeholder="내용을 입력하세요"
          rows="10"
        ></textarea>
      </div>

      <!-- 버튼 영역 -->
      <div class="button-group">
        <button type="button" class="btn btn-cancel" @click="goBack">취소</button>
        <button type="button" class="btn btn-save" @click="saveNotice">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { noticeAPI } from '@/api/notice'
import AppHeader from '@/components/common/Header.vue'

const route = useRoute()
const router = useRouter()
const notice = ref({
  title: '',
  content: '',
})
const isLoading = ref(true)
const error = ref(null)

// localStorage에서 관리자 여부 확인 및 권한 체크
const checkAdminAuth = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  if (!isAdmin) {
    // 관리자가 아닌 경우 목록 페이지로 리다이렉트
    router.push('/notice')
    return false
  }
  return true
}

// 공지사항 상세 정보 가져오기
const fetchNoticeDetail = async () => {
  const id = route.params.id
  if (!id) return

  isLoading.value = true
  error.value = null

  try {
    // 공지사항 상세 정보 조회
    const data = await noticeAPI.getNoticeDetail(id)
    notice.value = {
      ...data,
      // 필요한 필드가 없는 경우 기본값 설정
      title: data.title || '',
      content: data.content || '',
    }
  } catch (err) {
    error.value = '공지사항을 불러오는데 실패했습니다.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// 공지사항 저장
const saveNotice = async () => {
  // 폼 유효성 검사
  if (!notice.value.title.trim()) {
    alert('제목을 입력해주세요.')
    return
  }

  if (!notice.value.content.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  try {
    // 수정 API 호출
    await noticeAPI.updateNotice(route.params.id, notice.value)
    alert('공지사항이 수정되었습니다.')
    // 상세 페이지로 이동
    router.push(`/notice/${route.params.id}`)
  } catch (err) {
    error.value = '공지사항 수정에 실패했습니다.'
    console.error(err)
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

// 페이지 로드 시 실행
onMounted(() => {
  // 관리자 권한 체크
  if (!checkAdminAuth()) return

  // 데이터 가져오기
  fetchNoticeDetail()
})
</script>

<style scoped>
.notice-edit-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.notice-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
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

.notice-form-box {
  border: 1px solid #e0e0e0;
  padding: 30px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.content-textarea {
  min-height: 300px;
  resize: vertical;
  line-height: 1.6;
}

.divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 20px 0;
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

.btn-save {
  background-color: #4caf50;
  color: white;
}

.btn-save:hover {
  background-color: #3d9140;
}

.btn-list {
  background-color: #4caf50;
  color: white;
}

.btn-list:hover {
  background-color: #3d9140;
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
