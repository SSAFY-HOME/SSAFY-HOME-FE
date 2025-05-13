<template>
  <AppHeader />
  <div class="notice-write-container">
    <h1 class="page-title">공지사항 작성</h1>

    <!-- 작성 폼 -->
    <div class="notice-form-container">
      <!-- 제목 입력 -->
      <div class="form-group">
        <label for="title">제목</label>
        <input
          type="text"
          id="title"
          v-model="noticeForm.title"
          class="form-control"
          placeholder="공지사항 제목을 입력하세요"
          :class="{ error: validationErrors.title }"
        />
        <p v-if="validationErrors.title" class="error-text">{{ validationErrors.title }}</p>
      </div>

      <!-- 내용 입력 -->
      <div class="form-group">
        <label for="content">내용</label>
        <textarea
          id="content"
          v-model="noticeForm.content"
          class="form-control content-textarea"
          placeholder="공지사항 내용을 입력하세요"
          :class="{ error: validationErrors.content }"
        ></textarea>
        <p v-if="validationErrors.content" class="error-text">{{ validationErrors.content }}</p>
      </div>

      <!-- 버튼 영역 -->
      <div class="button-group">
        <button type="button" class="btn btn-cancel" @click="goBack" :disabled="isSubmitting">
          취소
        </button>
        <button type="button" class="btn btn-submit" @click="submitNotice" :disabled="isSubmitting">
          {{ isSubmitting ? '등록 중...' : '등록하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/Header.vue'
import { noticeAPI } from '@/api/notice'

const router = useRouter()
const isSubmitting = ref(false)

// 공지사항 폼 데이터
const noticeForm = reactive({
  title: '',
  content: '',
})

// 유효성 검사 오류
const validationErrors = reactive({
  title: '',
  content: '',
})

// 유효성 검사
const validateForm = () => {
  let isValid = true

  // 제목 검사
  if (!noticeForm.title.trim()) {
    validationErrors.title = '제목을 입력해주세요.'
    isValid = false
  } else {
    validationErrors.title = ''
  }

  // 내용 검사
  if (!noticeForm.content.trim()) {
    validationErrors.content = '내용을 입력해주세요.'
    isValid = false
  } else {
    validationErrors.content = ''
  }

  return isValid
}

// 공지사항 등록
const submitNotice = async () => {
  // 유효성 검사
  if (!validateForm()) {
    // 스크롤을 첫 번째 오류 필드로 이동
    const firstErrorElement = document.querySelector('.error')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  try {
    isSubmitting.value = true

    // 공지사항 데이터 준비
    const noticeData = {
      title: noticeForm.title.trim(),
      content: noticeForm.content.trim(),
    }

    // API 요청 - POST 메서드로 /notice 엔드포인트 호출
    const result = await noticeAPI.createNotice(noticeData)
    // 성공 시 목록 페이지로 이동
    alert(result.message || '공지사항이 성공적으로 등록되었습니다.')
    router.push('/notice')
  } catch (error) {
    // 오류가 발생하면 이 부분으로 제어가 넘어옴
    console.error('공지사항 등록 실패:', error)
    alert(error.message || '공지사항 등록에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

// 뒤로 가기
const goBack = () => {
  router.push('/notice')
}

onMounted(() => {
  if (localStorage.getItem('isAdmin') !== 'true') {
    alert('관리자만 공지사항을 작성할 수 있습니다.')
    router.push('/notice')
  }
})
</script>

<style scoped>
.notice-write-container {
  max-width: 800px;
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

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
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

.notice-form-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #4caf50;
}

.form-control.error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.content-textarea {
  min-height: 300px;
  resize: vertical;
  line-height: 1.6;
}

/* 버튼 영역 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #4caf50;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #43a047;
}

@media (max-width: 768px) {
  .notice-write-container {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .notice-form-container {
    padding: 20px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 15px;
  }
}
</style>
